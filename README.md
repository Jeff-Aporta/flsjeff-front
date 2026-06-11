# flsjeff-front

Interfaz estática tipo **imgbb** para **subir imágenes y archivos**, explorar la **galería** con metadatos (tamaño, MIME, hash) y **copiar URLs** públicas servidas desde Cloudflare R2. Pensada para adjuntos ligeros en tickets, documentación y otros servicios del ecosistema.

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-live-2ea44f?logo=githubpages&logoColor=white)](https://jeff-aporta.github.io/flsjeff-front/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MUI](https://img.shields.io/badge/MUI-5-007FFF?logo=mui&logoColor=white)](https://mui.com/)
[![Emotion](https://img.shields.io/badge/Emotion-11-D36AC2)](https://emotion.sh/)
[![Babel Standalone](https://img.shields.io/badge/Babel%20Standalone-7-F9DC3E?logo=babel&logoColor=black)](https://babeljs.io/)
[![Cloudflare Workers](https://img.shields.io/badge/API-Cloudflare%20Workers-F38020?logo=cloudflare&logoColor=white)](https://github.com/Jeff-Aporta/flsjeff-back)
[![Cloudflare R2](https://img.shields.io/badge/storage-R2-F38020?logo=cloudflare&logoColor=white)](https://www.cloudflare.com/products/r2/)
[![system-login](https://img.shields.io/badge/auth-system--login-007FFF)](https://github.com/Jeff-Aporta/system-login-front)
[![Sin build](https://img.shields.io/badge/build-sin%20paso%20de%20build-555)](https://github.com/Jeff-Aporta/flsjeff-front)

## Demo

**https://jeff-aporta.github.io/flsjeff-front/**

## Vista previa

![LoginGate y shell jeffimgbb](./docs/gh-pages.png)

## Qué hace

- **Drag & drop** o selector de archivos para subir a R2 vía Worker.
- **Galería** con vista previa de imágenes y metadatos técnicos.
- **Copiar URL** al portapapeles con un clic.
- **Tema** dark/light persistido y toggle **orquestador local :8780 / producción** (`main-orchestrator.jeffaporta.workers.dev`).
- Layout **sin scroll en body**: scroll solo en paneles internos.

## Desarrollo local

```bash
npx serve .          # front en http://localhost:3000
# wrangler dev en langlab/backend (:8780) + workers backend según necesidad
```

## Repos relacionados

| Repo | Rol |
|------|-----|
| [flsjeff-back](https://github.com/Jeff-Aporta/flsjeff-back) | API + R2 (Worker; el front llama vía **langlab gateway**) |
| [flsjeff-front](https://github.com/Jeff-Aporta/flsjeff-front) | Este panel (GH Pages) |

MIT · [Jeff-Aporta](https://github.com/Jeff-Aporta)
