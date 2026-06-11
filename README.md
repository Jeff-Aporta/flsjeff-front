# flsjeff-front

UI estática tipo **imgbb** para subir imágenes y archivos, ver la galería con metadatos y copiar URLs. Consume la API **[flsjeff-back](https://github.com/Jeff-Aporta/flsjeff-back)** (Cloudflare Worker). Publicada en **GitHub Pages**.

**Demo:** https://jeff-aporta.github.io/flsjeff-front/

## Stack

| Capa | Tecnología |
|------|------------|
| UI | React 18 + MUI 5 (UMD) + Emotion |
| Transpilación | Babel standalone (`.ts`/`.tsx` en el navegador, sin build) |
| Tema | Dark/light en tonos dodgerblue, persistido en `localStorage` |
| API | Switch local (`localhost:8787`) / online (`flsjeff.jeffaporta.workers.dev`) |

## Estructura

```
front/
├── index.html
├── css/base.css
└── js/
    ├── boot/loader.ts
    ├── core/config.ts    # URL de la API
    ├── api/client.ts
    ├── ui/theme.tsx · widgets.tsx
    └── app/App.tsx
```

## Desarrollo local

```bash
npx serve front      # http://localhost:3000
# Activa el switch "local" si corres el Worker con wrangler dev en :8787
```

## Publicación

GitHub Pages → rama `main`, carpeta raíz. Incluye `.nojekyll`.

## Repos relacionados

| Repo | Rol |
|------|-----|
| [flsjeff-back](https://github.com/Jeff-Aporta/flsjeff-back) | API serverless (privado) |
| [flsjeff-front](https://github.com/Jeff-Aporta/flsjeff-front) | Este front (público) |

## Licencia

MIT · [Jeff-Aporta](https://github.com/Jeff-Aporta)
