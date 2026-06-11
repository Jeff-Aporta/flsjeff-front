/* api/client — cliente HTTP de la API flsjeff (upload imágenes/archivos, lista, metadatos). */

interface UploadResult { ok: boolean; data?: any; error?: string; }

(function () {
  "use strict";
  const w = window as any;

  async function upload(kind: "images" | "files", file: File, title?: string): Promise<any> {
    const fd = new FormData();
    fd.append("file", file);
    if (title) fd.append("title", title);
    const res = await fetch(w.FLS.Config.apiUrl("/api/" + kind), { method: "POST", body: fd });
    const data = (await res.json().catch(() => null)) as UploadResult | null;
    if (!res.ok || !data || !data.ok) throw new Error((data && data.error) || ("HTTP " + res.status));
    return data.data;
  }

  async function list(kind?: "image" | "file", limit = 60): Promise<any[]> {
    const qs = "?limit=" + limit + (kind ? "&kind=" + kind : "");
    const res = await fetch(w.FLS.Config.apiUrl("/api/list" + qs));
    const data = await res.json().catch(() => null);
    if (!res.ok || !data || !data.ok) throw new Error((data && data.error) || ("HTTP " + res.status));
    return data.rows || [];
  }

  w.FLS = w.FLS || {};
  w.FLS.Api = {
    uploadImage: (f: File, t?: string) => upload("images", f, t),
    uploadFile: (f: File, t?: string) => upload("files", f, t),
    list,
  };
})();
