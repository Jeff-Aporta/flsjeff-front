/* Bootstrap: descarga, transpila (typescript+react) y ejecuta cada módulo en orden. */
declare const Babel: { transform(code: string, opts: unknown): { code: string } };

(function () {
  "use strict";
  const FILES = [
    "js/core/config.ts",
    "js/core/auth.ts",
    "js/api/client.ts",
    "js/ui/theme.tsx",
    "js/ui/widgets.tsx",
    "js/app/App.tsx",
  ];
  function showError(msg: string) {
    const root = document.getElementById("root");
    if (root) root.innerHTML = '<pre style="color:#ff8a80;padding:24px;font-family:monospace">' + msg + "</pre>";
  }
  async function run() {
    try {
      for (const file of FILES) {
        const res = await fetch(file + "?v=" + Date.now());
        if (!res.ok) throw new Error("No se pudo cargar " + file + " (" + res.status + ")");
        const presets = file.endsWith(".tsx") ? ["typescript", "react"] : ["typescript"];
        const out = Babel.transform(await res.text(), { presets, filename: file }).code;
        new Function(out)();
      }
      (window as any).FLS.mount();
    } catch (e: any) {
      showError("Error de arranque:\n" + (e && e.stack ? e.stack : e));
    }
  }
  run();
})();
