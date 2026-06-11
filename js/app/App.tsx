/* app/App — jeffimgbb: subir imágenes/archivos y ver la galería con metadatos. */
(function () {
  "use strict";
  const React = (window as any).React;
  const ReactDOM = (window as any).ReactDOM;
  const MUI = (window as any).MaterialUI;
  const w = window as any;
  const UI = w.FLS.UI;

  function CopyField(props: { value: string }) {
    const [done, setDone] = React.useState(false);
    return React.createElement(MUI.Stack, { direction: "row", spacing: 0.5, alignItems: "center" },
      React.createElement("span", { className: "meta-mono" }, props.value),
      React.createElement(MUI.IconButton, {
        size: "small",
        onClick: () => { navigator.clipboard.writeText(props.value); setDone(true); setTimeout(() => setDone(false), 1200); },
      }, React.createElement(UI.Icon, { icon: done ? "mdi:check" : "mdi:content-copy", size: 16 })));
  }

  function MetaCard(item: any) {
    const isImg = item.kind === "image";
    return React.createElement(MUI.Card, { variant: "outlined" },
      isImg && React.createElement(MUI.CardMedia, {
        component: "img", image: item.url, alt: item.filename,
        sx: { height: 160, objectFit: "contain", bgcolor: "rgba(0,0,0,0.2)" },
      }),
      React.createElement(MUI.CardContent, { sx: { py: 1.5 } },
        React.createElement(MUI.Stack, { direction: "row", spacing: 1, alignItems: "center", sx: { mb: 0.5 } },
          React.createElement(UI.Icon, { icon: isImg ? "mdi:image-outline" : "mdi:file-outline" }),
          React.createElement(MUI.Typography, { variant: "subtitle2", noWrap: true, sx: { flexGrow: 1 } }, item.filename),
          React.createElement(MUI.Chip, { size: "small", label: item.ext || "?" })),
        React.createElement(MUI.Typography, { variant: "caption", color: "text.secondary" },
          UI.humanSize(item.size) + (item.width ? "  ·  " + item.width + "×" + item.height : "") + (item.mime ? "  ·  " + item.mime : "")),
        React.createElement(MUI.Box, { sx: { mt: 1 } }, React.createElement(CopyField, { value: item.url }))));
  }

  function Uploader(props: { kind: "image" | "file"; onDone: () => void }) {
    const [drag, setDrag] = React.useState(false);
    const [busy, setBusy] = React.useState(false);
    const [err, setErr] = React.useState<string | null>(null);
    const inputRef = React.useRef(null);

    async function handle(files: FileList | null) {
      if (!files || !files.length) return;
      setBusy(true); setErr(null);
      try {
        for (const f of Array.from(files)) {
          if (props.kind === "image") await w.FLS.Api.uploadImage(f as File);
          else await w.FLS.Api.uploadFile(f as File);
        }
        props.onDone();
      } catch (e: any) { setErr(e.message); }
      finally { setBusy(false); }
    }

    return React.createElement(MUI.Box, null,
      err && React.createElement(MUI.Alert, { severity: "error", sx: { mb: 2 } }, err),
      React.createElement("div", {
        className: "dropzone" + (drag ? " drag" : ""),
        onClick: () => (inputRef.current as any)?.click(),
        onDragOver: (e: any) => { e.preventDefault(); setDrag(true); },
        onDragLeave: () => setDrag(false),
        onDrop: (e: any) => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files); },
      },
        React.createElement(UI.Icon, { icon: busy ? "mdi:loading" : (props.kind === "image" ? "mdi:image-plus-outline" : "mdi:file-upload-outline"), size: 40 }),
        React.createElement(MUI.Typography, { sx: { mt: 1 } },
          busy ? "Subiendo…" : "Arrastra " + (props.kind === "image" ? "imágenes" : "archivos") + " aquí o haz clic"),
        React.createElement("input", {
          ref: inputRef, type: "file", multiple: true, hidden: true,
          accept: props.kind === "image" ? "image/*" : undefined,
          onChange: (e: any) => handle(e.target.files),
        })));
  }

  function App() {
    const tm = w.FLS.Theme.useThemeMode();
    const theme = React.useMemo(() => w.FLS.Theme.makeTheme(tm.mode), [tm.mode]);
    const [tab, setTab] = React.useState<"image" | "file">("image");
    const [items, setItems] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(false);

    function reload() {
      setLoading(true);
      w.FLS.Api.list(tab).then((rows: any[]) => setItems(rows)).catch(() => setItems([])).finally(() => setLoading(false));
    }
    React.useEffect(reload, [tab]);

    return React.createElement(MUI.ThemeProvider, { theme },
      React.createElement(MUI.CssBaseline, null),
      React.createElement(MUI.AppBar, { position: "static", color: "default", elevation: 0, sx: { borderBottom: 1, borderColor: "divider" } },
        React.createElement(MUI.Toolbar, { sx: { gap: 1 } },
          React.createElement(UI.Icon, { icon: "mdi:cloud-upload-outline", size: 26 }),
          React.createElement(MUI.Typography, { variant: "h6", sx: { flexGrow: 1 } }, "jeffimgbb"),
          React.createElement(UI.TargetSwitch, null),
          React.createElement(MUI.Tooltip, { title: "Recargar" },
            React.createElement(MUI.IconButton, { size: "small", color: "inherit", onClick: reload },
              React.createElement(UI.Icon, { icon: "mdi:refresh" }))),
          React.createElement(UI.ThemeSwitch, { mode: tm.mode, onToggle: tm.toggle }))),
      React.createElement(MUI.Container, { sx: { py: 3 } },
        React.createElement(MUI.Tabs, { value: tab, onChange: (_e: any, v: any) => setTab(v), sx: { mb: 2 } },
          React.createElement(MUI.Tab, { value: "image", label: "Imágenes", icon: React.createElement(UI.Icon, { icon: "mdi:image-multiple-outline" }), iconPosition: "start" }),
          React.createElement(MUI.Tab, { value: "file", label: "Archivos", icon: React.createElement(UI.Icon, { icon: "mdi:file-multiple-outline" }), iconPosition: "start" })),
        React.createElement(MUI.Box, { sx: { mb: 3 } }, React.createElement(Uploader, { kind: tab, onDone: reload })),
        loading
          ? React.createElement(MUI.Box, { sx: { display: "flex", justifyContent: "center", p: 4 } }, React.createElement(MUI.CircularProgress, null))
          : !items.length
            ? React.createElement(MUI.Alert, { severity: "info" }, "Aún no hay " + (tab === "image" ? "imágenes" : "archivos") + ".")
            : React.createElement(MUI.Grid, { container: true, spacing: 2 },
                items.map((it: any) => React.createElement(MUI.Grid, { item: true, xs: 12, sm: 6, md: 4, lg: 3, key: it.id },
                  React.createElement(MetaCard, it))))));
  }

  w.FLS = w.FLS || {};
  w.FLS.mount = () => ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App));
})();
