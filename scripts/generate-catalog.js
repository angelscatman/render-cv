const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const primaryPdfDir = path.join(rootDir, 'public', 'PDFs');
const fallbackPdfDir = path.join(rootDir, 'PDFs');

let pdfDir = primaryPdfDir;
if (!fs.existsSync(primaryPdfDir) || fs.readdirSync(primaryPdfDir).filter(f => f.endsWith('.pdf')).length === 0) {
  if (fs.existsSync(fallbackPdfDir)) {
    pdfDir = fallbackPdfDir;
  }
}

const catalogDir = path.join(rootDir, 'public', 'catalog');
if (!fs.existsSync(catalogDir)) {
  fs.mkdirSync(catalogDir, { recursive: true });
}

let pdfFiles = [];
if (fs.existsSync(pdfDir)) {
  pdfFiles = fs.readdirSync(pdfDir).filter(file => file.endsWith('.pdf'));
}

// Extract GitHub Repository Owner and Name dynamically from environment variables
const fullRepo = process.env.GITHUB_REPOSITORY || '';
const repoOwner = process.env.GITHUB_REPOSITORY_OWNER || (fullRepo ? fullRepo.split('/')[0] : 'owner');
const repoName = fullRepo.includes('/') ? fullRepo.split('/')[1] : (process.env.GITHUB_REPOSITORY_NAME || 'repo');

const baseUrl = `https://${repoOwner}.github.io/${repoName}/PDFs`;
const now = new Date().toISOString();
const defaultLanguage = process.env.DEFAULT_LANGUAGE ? process.env.DEFAULT_LANGUAGE.trim().toUpperCase() : 'ES';

// Helper to find common prefix across a list of strings
function findCommonPrefix(strings) {
  if (!strings || strings.length < 2) return '';
  let prefix = strings[0];
  for (let i = 1; i < strings.length; i++) {
    while (!strings[i].startsWith(prefix)) {
      prefix = prefix.substring(0, prefix.length - 1);
      if (prefix === '') return '';
    }
  }
  const lastHyphen = prefix.lastIndexOf('-');
  if (lastHyphen !== -1) {
    prefix = prefix.substring(0, lastHyphen + 1);
  }
  return prefix;
}

// Extract language and base identifier
const parsedItems = pdfFiles.map(file => {
  const id = path.basename(file, '.pdf');
  let language = defaultLanguage;
  let baseId = id;

  // Detect 2 or 3 letter language code suffix (e.g. -EN, -ES, -ENG, -SPA, -DE, -FR)
  const langMatch = id.match(/[-_]([a-zA-Z]{2,3})$/);
  if (langMatch) {
    language = langMatch[1].toUpperCase();
    baseId = id.slice(0, -langMatch[0].length);
  }

  return { file, id, language, baseId };
});

const baseIds = parsedItems.map(item => item.baseId);
const commonPrefix = findCommonPrefix(baseIds);

const catalog = parsedItems.map(item => {
  let role = '';

  if (commonPrefix && item.baseId.startsWith(commonPrefix) && item.baseId.length > commonPrefix.length) {
    role = item.baseId.slice(commonPrefix.length).replace(/^[-_]+|[-_]+$/g, '');
  } else {
    // Agnostic fallback parsing: remove standard doc type prefix and sanitize hyphens
    let clean = item.baseId.replace(/^(CV|Resume|Curriculum|Resumen)[-_]/i, '').replace(/^[-_]+|[-_]+$/g, '');
    role = clean;
  }

  if (!role) {
    role = item.baseId;
  }

  return {
    id: item.id,
    role,
    language: item.language,
    url: `${baseUrl}/${item.file}`,
    lastUpdated: now
  };
});

const outputPath = path.join(catalogDir, 'index.json');
fs.writeFileSync(outputPath, JSON.stringify(catalog, null, 2), 'utf8');

console.log(`Successfully generated catalog at ${outputPath} with ${catalog.length} item(s):`);
console.log(JSON.stringify(catalog, null, 2));
