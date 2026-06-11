/* app/App — jeffimgbb: subir imágenes/archivos y ver la galería con metadatos. */
(function () {
  "use strict";
  const MUI = MaterialUI;
  const UI = window.FLS.UI;

  function CopyField(props: { value: string }) {
    const [done, setDone] = React.useState(false);
    return React.createElement(MUI.Stack, { direction: "row", spacing: 0.5, alignItems: "center" },
      React.createElement("span", { className: "meta-mono" }, props.value),
      React.createElement(MUI.IconButton, {
        size: "small",
        onClick: () => { navigator.clipboard.writeText(props.value); setDone(true); setTimeout(() => setDone(false), 1200); },
      }, React.createElement(UI.Icon, { icon: done ? "mdi:check" : "mdi:content-copy", size: 16 })));
  }

  const MetaCard: FC<FlsFileItem> = function MetaCard(props) {
    const isImg = props.kind === "image";
    return React.createElement(MUI.Card, { variant: "outlined" },
      isImg && React.createElement(MUI.CardMedia, {
        component: "img", image: props.url, alt: props.filename,
        sx: { height: 160, objectFit: "contain", bgcolor: "rgba(0,0,0,0.2)" },
      }),
      React.createElement(MUI.CardContent, { sx: { py: 1.5 } },
        React.createElement(MUI.Stack, { direction: "row", spacing: 1, alignItems: "center", sx: { mb: 0.5 } },
          React.createElement(UI.Icon, { icon: isImg ? "mdi:image-outline" : "mdi:file-outline" }),
          React.createElement(MUI.Typography, { variant: "subtitle2", noWrap: true, sx: { flexGrow: 1 } }, props.filename),
          React.createElement(MUI.Chip, { size: "small", label: props.ext || "?" })),
        React.createElement(MUI.Typography, { variant: "caption", color: "text.secondary" },
          UI.humanSize(props.size) + (props.width ? "  ·  " + props.width + "×" + props.height : "") + (props.mime ? "  ·  " + props.mime : "")),
        React.createElement(MUI.Box, { sx: { mt: 1 } }, React.createElement(CopyField, { value: props.url }))));
  };

  function Uploader(props: { kind: "image" | "file"; onDone: () => void }) {
    const [drag, setDrag] = React.useState(false);
    const [busy, setBusy] = React.useState(false);
    const [err, setErr] = React.useState<string | null>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    async function handle(files: FileList | null) {
      if (!files || !files.length) return;
      setBusy(true); setErr(null);
      try {
        for (const f of Array.from(files)) {
          if (props.kind === "image") await window.FLS.Api.uploadImage(f);
          else await window.FLS.Api.uploadFile(f);
        }
        props.onDone();
      } catch (e) {
        setErr(e instanceof Error ? e.message : String(e));
      } finally { setBusy(false); }
    }

    return React.createElement(MUI.Box, null,
      err && React.createElement(MUI.Alert, { severity: "error", sx: { mb: 2 } }, err),
      React.createElement("div", {
        className: "dropzone" + (drag ? " drag" : ""),
        onClick: () => inputRef.current?.click(),
        onDragOver: (e: DragEvent) => { e.preventDefault(); setDrag(true); },
        onDragLeave: () => setDrag(false),
        onDrop: (e: DragEvent) => { e.preventDefault(); setDrag(false); handle(e.dataTransfer?.files ?? null); },
      },
        React.createElement(UI.Icon, { icon: busy ? "mdi:loading" : (props.kind === "image" ? "mdi:image-plus-outline" : "mdi:file-upload-outline"), size: 40 }),
        React.createElement(MUI.Typography, { sx: { mt: 1 } },
          busy ? "Subiendo…" : "Arrastra " + (props.kind === "image" ? "imágenes" : "archivos") + " aquí o haz clic"),
        React.createElement("input", {
          ref: inputRef, type: "file", multiple: true, hidden: true,
          accept: props.kind === "image" ? "image/*" : undefined,
          onChange: (e: Event) => handle((e.target as HTMLInputElement).files),
        })));
  }

  function App() {
    const Shell = window.ISAFront.Layout.AppShell;
    const [tab, setTab] = React.useState<"image" | "file">("image");
    const [items, setItems] = React.useState<FlsFileItem[]>([]);
    const [loading, setLoading] = React.useState(false);

    function reload() {
      setLoading(true);
      window.FLS.Api.list(tab).then((rows) => setItems(rows)).catch(() => setItems([])).finally(() => setLoading(false));
    }
    React.useEffect(reload, [tab]);

    const gallery = loading
      ? React.createElement(MUI.Box, { sx: { display: "flex", justifyContent: "center", p: 4 } }, React.createElement(MUI.CircularProgress, null))
      : !items.length
        ? React.createElement(MUI.Alert, { severity: "info" }, "Aún no hay " + (tab === "image" ? "imágenes" : "archivos") + ".")
        : React.createElement(MUI.Grid, { container: true, spacing: 2 },
            items.map((it) => React.createElement(MUI.Grid, { size: { xs: 12, sm: 6, md: 4, lg: 3 }, key: it.id },
              React.createElement(MetaCard, it))));

    const panel = React.createElement(React.Fragment, null,
      React.createElement(MUI.Tabs, { value: tab, onChange: (_e: unknown, v: "image" | "file") => setTab(v), sx: { mb: 2 } },
        React.createElement(MUI.Tab, { value: "image", label: "Imágenes", icon: React.createElement(UI.Icon, { icon: "mdi:image-multiple-outline" }), iconPosition: "start" }),
        React.createElement(MUI.Tab, { value: "file", label: "Archivos", icon: React.createElement(UI.Icon, { icon: "mdi:file-multiple-outline" }), iconPosition: "start" })),
      React.createElement(MUI.Box, { sx: { mb: 3 } }, React.createElement(Uploader, { kind: tab, onDone: reload })),
      gallery);

    return React.createElement(Shell, {
      ns: "FLS",
      title: "Archivos e imágenes",
      icon: "mdi:cloud-upload-outline",
      loginGate: true,
      toolbarExtra: React.createElement(MUI.Tooltip, { title: "Recargar" },
        React.createElement(MUI.IconButton, { size: "small", color: "inherit", onClick: reload },
          React.createElement(UI.Icon, { icon: "mdi:refresh" }))),
    }, React.createElement(MUI.Container, { sx: { py: 3 } }, panel));
  }

  window.FLS = window.FLS || ({} as FlsNs);
  window.FLS.mount = () => {
    const root = document.getElementById("root");
    if (!root) throw new Error("No se encontró #root");
    ReactDOM.createRoot(root).render(React.createElement(App));
  };
  window.FLS.mount();
})();
