/* api/client — flsjeff vía gateway (/api/images, /api/list, /raw/…). */

interface UploadResult { ok: boolean; data?: FlsFileItem; error?: string; }

(function () {
  "use strict";

  function gwBase() {
    return window.FLS.Config.base();
  }

  function normalizeItem(item: FlsFileItem): FlsFileItem {
    const rw = window.ISAFront?.rewriteFlsItem;
    return rw ? rw(item, gwBase()) : item;
  }

  async function upload(kind: "images" | "files", file: File, title?: string): Promise<FlsFileItem> {
    const fd = new FormData();
    fd.append("file", file);
    if (title) fd.append("title", title);
    const res = await fetch(window.FLS.Config.apiUrl("/api/" + kind), { method: "POST", body: fd });
    const data = (await res.json().catch(() => null)) as UploadResult | null;
    if (!res.ok || !data || !data.ok) throw new Error((data && data.error) || ("HTTP " + res.status));
    return normalizeItem(data.data as FlsFileItem);
  }

  async function list(kind?: "image" | "file", limit = 60): Promise<FlsFileItem[]> {
    const qs = "?limit=" + limit + (kind ? "&kind=" + kind : "");
    const res = await fetch(window.FLS.Config.apiUrl("/api/list" + qs));
    const data = await res.json().catch(() => null) as { ok?: boolean; error?: string; rows?: FlsFileItem[] } | null;
    if (!res.ok || !data || !data.ok) throw new Error((data && data.error) || ("HTTP " + res.status));
    return (data.rows || []).map(normalizeItem);
  }

  window.FLS = window.FLS || ({} as FlsNs);
  window.FLS.Api = {
    uploadImage: (f: File, t?: string) => upload("images", f, t),
    uploadFile: (f: File, t?: string) => upload("files", f, t),
    list,
  };
})();
