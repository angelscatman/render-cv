# Mis CVs (con RenderCV)

<p align="center">
	<img src="https://raw.githubusercontent.com/rendercv/rendercv/main/docs/overrides/.icons/custom/rendercv.svg" alt="RenderCV" width="120">
</p>

<p align="center">
	<strong>Configuración personal para generar currículums en PDF usando RenderCV.</strong>
</p>

<p align="center">
	<a href="https://docs.rendercv.com/">
		<img src="https://img.shields.io/badge/RenderCV-Docs-2f6feb?style=flat-square&logo=read-the-docs" alt="RenderCV Docs">
	</a>
	<a href="https://www.docker.com/">
		<img src="https://img.shields.io/badge/Docker-Ready-2496ed?style=flat-square&logo=docker&logoColor=white" alt="Docker Ready">
	</a>
</p>

---

## Sobre este repositorio

Este repositorio contiene mi configuración para mantener actualizadas distintas versiones de mi CV, por ejemplo Full-Stack.

La información y el diseño están separados en archivos YAML. Uso un script junto con Docker para compilar los PDFs, para evitar instalar dependencias directamente en el sistema.

## Requisitos

- Docker instalado y en ejecución.
- Bash.

## Estructura de carpetas

Cada versión del CV se encuentra en su propio directorio con estos archivos:

```text
CV-Nombre-De-La-Version/
├── cv.yaml       # Datos del CV: experiencia, educación, proyectos
├── design.yaml   # Márgenes, fuentes, colores y tema visual
├── locale.yaml   # Idioma de encabezados y textos
└── settings.yaml # Configuración de RenderCV
```

## Cómo compilar en local

Para generar el PDF, ejecuta el script `render.sh` y pasa como argumento el nombre de la carpeta correspondiente.

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

## Renderizado con GitHub Actions

Este repositorio incluye un workflow en `.github/workflows/render.yml` para generar los PDFs automáticamente.

- Se ejecuta en cada push a `main`.
- Puede ejecutarse manualmente con `workflow_dispatch`.
- Publica los PDFs generados como artifacts del job.

Ejecución manual:

- `profile: all` genera todos los perfiles.
- `profile: CV-Nombre-De-La-Version` genera solo un perfil.

## Notas

- Los PDFs finales y los archivos temporales no se incluyen en el repositorio porque están configurados en `.gitignore`.
- Para crear una nueva versión del CV, basta con duplicar una de las carpetas, modificar los datos en `cv.yaml` y volver a ejecutar el script.