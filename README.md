<p align="center">
  <img src="https://api.iconify.design/mdi/cloud-upload-outline.svg?color=%2300838f&width=96&height=96" width="96" height="96" alt="flsjeff" />
</p>

<h1 align="center">flsjeff-front</h1>

<p align="center"><strong>Host de imágenes y archivos</strong> — subida a R2, galería con metadatos y URLs públicas para el ecosistema Jeff-Aporta.</p>

## Arquitectura
![Diagrama de arquitectura](https://mermaid.ink/img/JSV7aW5pdDogeyJmbG93Y2hhcnQiOiB7ImN1cnZlIjogInN0ZXBBZnRlciIsICJodG1sTGFiZWxzIjogdHJ1ZSwgIm5vZGVTcGFjaW5nIjogNDQsICJyYW5rU3BhY2luZyI6IDUyLCAicGFkZGluZyI6IDE4fX19JSUKZmxvd2NoYXJ0IExSCiAgRltmbHNqZWZmLWZyb250XQogIEZTW2Zyb250LXNoYXJlZF0KICBPUkNIW21haW4tb3JjaGVzdHJhdG9yXQogIEFQSVtmbHNqZWZmIFdvcmtlcl0KICBSMlsoUjIpXQogIEYgLS0-IEZTCiAgRiAtLT58UE9TVCAvYXBpL2ltYWdlc3wgT1JDSCAtLT4gQVBJIC0tPiBSMgogIEYgLS0-fEdFVCAvYXBpL3Jhdy8qfCBPUkNI)

> **Fuente del diagrama:** [`docs/arquitectura.mmd`](docs/arquitectura.mmd) — editar el `.mmd`; regenerar imagen: `node scripts/mermaid-ink-url.mjs flsjeff/frontend/docs/arquitectura.mmd` (desde `apps/`).

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-live-2ea44f?logo=githubpages&logoColor=white)](https://jeff-aporta.github.io/flsjeff-front/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Cloudflare R2](https://img.shields.io/badge/storage-R2-F38020?logo=cloudflare&logoColor=white)](https://www.cloudflare.com/products/r2/)
[![Cloudflare Workers](https://img.shields.io/badge/API-Cloudflare%20Workers-F38020?logo=cloudflare&logoColor=white)](https://github.com/Jeff-Aporta/flsjeff-back)

## Demo

**https://jeff-aporta.github.io/flsjeff-front/**

## Vista previa

![LoginGate y shell jeffimgbb](./docs/gh-pages.png)

## Qué hace

- **Drag & drop** o selector de archivos para subir a R2 vía Worker.
- **Galería** con vista previa de imágenes y metadatos técnicos.
- **Copiar URL** al portapapeles con un clic.
- **Tema** dark/light y toggle **local / producción** (TargetSwitch).
- Layout **sin scroll en body**: scroll solo en paneles internos.

## Metadatos

Icono: `mdi:cloud-upload-outline` · tema `#00838f` · [`JeffAppMeta`](https://github.com/Jeff-Aporta/front-shared/blob/main/cdn/isa/js/core/app-meta.js).

## Desarrollo local

```bash
npx serve .
# TargetSwitch → modo local + wrangler dev en flsjeff-back según necesidad
```

## Repos relacionados

| Repo | Rol |
|------|-----|
| [flsjeff-back](https://github.com/Jeff-Aporta/flsjeff-back) | API + R2 (Worker) |
| [flsjeff-front](https://github.com/Jeff-Aporta/flsjeff-front) | Este panel (GH Pages) |

MIT · [Jeff-Aporta](https://github.com/Jeff-Aporta)
