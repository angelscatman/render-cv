# Mis CVs (con RenderCV)

<p align="center">
	<img src="https://raw.githubusercontent.com/rendercv/rendercv/main/docs/overrides/.icons/custom/rendercv.svg" alt="RenderCV" width="120">
</p>

<p align="center">
	<strong>Configuración personal para generar y publicar currículums en PDF usando RenderCV y GitHub Pages.</strong>
</p>

<p align="center">
	<a href="https://docs.rendercv.com/">
		<img src="https://img.shields.io/badge/RenderCV-Docs-2f6feb?style=flat-square&logo=read-the-docs" alt="RenderCV Docs">
	</a>
	<a href="https://www.docker.com/">
		<img src="https://img.shields.io/badge/Docker-Ready-2496ed?style=flat-square&logo=docker&logoColor=white" alt="Docker Ready">
	</a>
	<a href="https://pages.github.com/">
		<img src="https://img.shields.io/badge/GitHub%20Pages-Live-22c55e?style=flat-square&logo=github" alt="GitHub Pages">
	</a>
</p>

---

## [+] Sobre este repositorio

Este repositorio mantiene actualizadas distintas versiones de mi CV (Full-Stack, Mobile, Ingeniería de Sistemas, etc.).

La información y el diseño están separados en archivos YAML. Utiliza RenderCV encapsulado en Docker para compilar los PDFs localmente sin instalar dependencias en el sistema, y un workflow de GitHub Actions que automatiza la generación de los PDFs, construye un catálogo dinámico en formato JSON y despliega todo automáticamente a **GitHub Pages** para consumirlo desde un portafolio web.

## [+] Requisitos

- Docker instalado y en ejecución (para compilación local).
- Bash.
- Node.js (opcional, para probar la generación del catálogo JSON localmente).

## [+] Estructura de carpetas

Cada versión del CV se encuentra en su propio directorio con la siguiente estructura:

```text
+-- CV-Nombre-De-La-Version/
|   +-- cv.yaml       # Datos del CV: experiencia, educación, proyectos
|   +-- design.yaml   # Márgenes, fuentes, colores y tema visual
|   +-- locale.yaml   # Idioma de encabezados y textos
|   +-- settings.yaml # Configuración de RenderCV
```

### Convención de nombres

El sistema detecta el rol y el idioma a partir del nombre de la carpeta (soporta sufijos ISO de 2 y 3 letras):

- `CV-Angel-Cecilio-Fullstack` -> Rol: `Fullstack` | Idioma: `ES`
- `CV-Angel-Cecilio-Fullstack-EN` -> Rol: `Fullstack` | Idioma: `EN`
- `Resume-JohnDoe-Frontend-ENG` -> Rol: `Frontend` | Idioma: `ENG`

## [+] Cómo compilar en local

Para generar el PDF, ejecuta el script `render.sh` pasando como argumento el nombre de la carpeta correspondiente:

```bash
# Dar permisos al script solo la primera vez
chmod +x render.sh

# Generar el PDF
./render.sh <nombre-de-la-carpeta>
```

Ejemplo:

```bash
./render.sh CV-Angel-Cecilio-Fullstack
```

El script procesa los archivos y guarda el PDF generado dentro de la carpeta `PDFs/`.

### Generar el catálogo JSON en local (Opcional)

Para probar la generación del catálogo JSON en local tras compilar:

```bash
node scripts/generate-catalog.js
```

## [+] CI/CD y Despliegue con GitHub Actions

Este repositorio incluye un workflow en `.github/workflows/render.yml` que realiza el flujo completo de compilación y publicación:

```text
[ Push / Dispatch ] --> [ Compilar PDFs ] --> [ Generar Catalog JSON ] --> [ Publicar en gh-pages ]
```

- **Compilación selectiva**: En cada `push` a `main`, detecta y procesa únicamente las carpetas de perfil modificadas.
- **Ejecución manual (`workflow_dispatch`)**:
  - `profile: all` genera todos los perfiles.
  - `profile: CV-Nombre-De-La-Version` genera solo el perfil seleccionado.
- **Generación de Catálogo**: Ejecuta `scripts/generate-catalog.js` para construir el archivo `public/catalog/index.json`.
- **Despliegue**: Publica el contenido de `public/` en la rama `gh-pages` mediante `peaceiris/actions-gh-pages@v3`.

### Estructura del Catálogo (`public/catalog/index.json`)

```json
[
  {
    "id": "CV-Angel-Cecilio-Fullstack",
    "role": "Fullstack",
    "language": "ES",
    "url": "https://<usuario>.github.io/<repo>/PDFs/CV-Angel-Cecilio-Fullstack.pdf",
    "lastUpdated": "2026-07-22T15:00:00.000Z"
  }
]
```

## [+] Notas

- Para crear una nueva versión del CV, basta con duplicar una de las carpetas, modificar los datos en `cv.yaml` y hacer push a `main`.