# jeffimgbb — Front (flsjeff)

UI estática tipo imgbb para subir imágenes/archivos y ver la galería con metadatos. Consume la **API flsjeff** (Cloudflare Worker, repo aparte). Se publica en **GitHub Pages**.

> Repo **público**. Sin build: React + MUI por UMD y Babel standalone transpila el código TypeScript en el navegador.

## Stack

- React 18 + MUI 5 (UMD) + Emotion
- Babel standalone (transpila `.ts`/`.tsx` en el navegador)
- Tema **dark/light** en tonos **dodgerblue**, con switch persistido
- Switch **local/online** para apuntar a `localhost:8787` (wrangler dev) o al Worker publicado

## Estructura

```
front/
├── index.html            # stack UMD + bootstrap que arranca js/boot/loader.ts
├── css/base.css
└── js/                   # todo .ts/.tsx
    ├── boot/loader.ts    # transpila y carga los módulos en orden
    ├── core/config.ts    # base de la API + switch local/online
    ├── api/client.ts     # uploadImage / uploadFile / list
    ├── ui/  theme.tsx · widgets.tsx
    └── app/App.tsx        # tabs Imágenes/Archivos, dropzone, galería con metadatos
```

## Configurar la API

Edita `js/core/config.ts` y pon en `ONLINE` la URL del Worker publicado:
```
const ONLINE = "https://flsjeff.<tu-subdominio>.workers.dev";
```

## Local

```bash
npx serve front      # http://localhost:3000 ; activa el switch "local" si corres el Worker en :8787
```

## Publicar en GitHub Pages

Pages → Source: rama `main`, carpeta raíz (`/`). Incluye `.nojekyll`. La app queda en `https://<usuario>.github.io/<repo>/`.

## Uso

1. Pestaña **Imágenes** o **Archivos**.
2. Arrastra o haz clic para subir (múltiple).
3. La galería muestra cada elemento con su **peso, dimensiones, extensión y URL** (con botón de copiar).
