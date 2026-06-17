/* app/App — flsjeff: subir imágenes/archivos y ver la galería con metadatos. */
(function () {
  "use strict";
  const MUI = MaterialUI;
  const UI = window.FLS.UI;

  function CopyField({ value }) {
    const [done, setDone] = React.useState(false);
    return (
      <MUI.Stack direction="row" spacing={0.5} alignItems="center">
        <span className="meta-mono">{value}</span>
        <MUI.IconButton
          size="small"
          onClick={() => { navigator.clipboard.writeText(value); setDone(true); setTimeout(() => setDone(false), 1200); }}
        >
          <UI.Icon icon={done ? "mdi:check" : "mdi:content-copy"} size={16} />
        </MUI.IconButton>
      </MUI.Stack>
    );
  }

  function MetaCard(props) {
    const isImg = props.kind === "image";
    return (
      <MUI.Card variant="outlined">
        {isImg && (
          <MUI.CardMedia
            component="img"
            image={props.url}
            alt={props.filename}
            sx={{ height: 160, objectFit: "contain", bgcolor: "rgba(0,0,0,0.2)" }}
          />
        )}
        <MUI.CardContent sx={{ py: 1.5 }}>
          <MUI.Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
            <UI.Icon icon={isImg ? "mdi:image-outline" : "mdi:file-outline"} />
            <MUI.Typography variant="subtitle2" noWrap sx={{ flexGrow: 1 }}>{props.filename}</MUI.Typography>
            <MUI.Chip size="small" label={props.ext || "?"} />
          </MUI.Stack>
          <MUI.Typography variant="caption" color="text.secondary">
            {UI.humanSize(props.size) + (props.width ? "  ·  " + props.width + "×" + props.height : "") + (props.mime ? "  ·  " + props.mime : "")}
          </MUI.Typography>
          <MUI.Box sx={{ mt: 1 }}><CopyField value={props.url} /></MUI.Box>
        </MUI.CardContent>
      </MUI.Card>
    );
  }

  function Uploader({ kind, onDone }) {
    const [drag, setDrag] = React.useState(false);
    const [busy, setBusy] = React.useState(false);
    const [err, setErr] = React.useState(null);
    const inputRef = React.useRef(null);

    async function handle(files) {
      if (!files || !files.length) return;
      setBusy(true); setErr(null);
      try {
        for (const f of Array.from(files)) {
          if (kind === "image") await window.FLS.Api.uploadImage(f);
          else await window.FLS.Api.uploadFile(f);
        }
        onDone();
      } catch (e) {
        setErr(e instanceof Error ? e.message : String(e));
      } finally { setBusy(false); }
    }

    return (
      <MUI.Box>
        {err && <MUI.Alert severity="error" sx={{ mb: 2 }}>{err}</MUI.Alert>}
        <div
          className={"dropzone" + (drag ? " drag" : "")}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); handle(e.dataTransfer?.files ?? null); }}
        >
          <UI.Icon icon={busy ? "mdi:loading" : (kind === "image" ? "mdi:image-plus-outline" : "mdi:file-upload-outline")} size={40} />
          <MUI.Typography sx={{ mt: 1 }}>
            {busy ? "Subiendo…" : "Arrastra " + (kind === "image" ? "imágenes" : "archivos") + " aquí o haz clic"}
          </MUI.Typography>
          <input
            ref={inputRef}
            type="file"
            multiple
            hidden
            accept={kind === "image" ? "image/*" : undefined}
            onChange={(e) => handle(e.target.files)}
          />
        </div>
      </MUI.Box>
    );
  }

  function App() {
    const Shell = window.ISAFront.Layout.AppShell;
    const [tab, setTab] = React.useState("image");
    const [items, setItems] = React.useState([]);
    const [loading, setLoading] = React.useState(false);

    function reload() {
      setLoading(true);
      window.FLS.Api.list(tab).then((rows) => setItems(rows)).catch(() => setItems([])).finally(() => setLoading(false));
    }
    React.useEffect(reload, [tab]);

    const gallery = loading ? (
      <MUI.Box sx={{ display: "flex", justifyContent: "center", p: 4 }}><MUI.CircularProgress /></MUI.Box>
    ) : !items.length ? (
      <MUI.Alert severity="info">{"Aún no hay " + (tab === "image" ? "imágenes" : "archivos") + "."}</MUI.Alert>
    ) : (
      <MUI.Grid container spacing={2}>
        {items.map((it) => (
          <MUI.Grid key={it.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <MetaCard {...it} />
          </MUI.Grid>
        ))}
      </MUI.Grid>
    );

    const panel = (
      <>
        <MUI.Tabs value={tab} onChange={(_e, v) => setTab(v)} sx={{ mb: 2 }}>
          <MUI.Tab value="image" label="Imágenes" icon={<UI.Icon icon="mdi:image-multiple-outline" />} iconPosition="start" />
          <MUI.Tab value="file" label="Archivos" icon={<UI.Icon icon="mdi:file-multiple-outline" />} iconPosition="start" />
        </MUI.Tabs>
        <MUI.Box sx={{ mb: 3 }}><Uploader kind={tab} onDone={reload} /></MUI.Box>
        {gallery}
      </>
    );

    return (
      <Shell ns="FLS" loginGate toolbarExtra={
        <MUI.Tooltip title="Recargar"><MUI.IconButton size="small" color="inherit" onClick={reload}><UI.Icon icon="mdi:refresh" /></MUI.IconButton></MUI.Tooltip>
      }>
        <MUI.Container sx={{ py: 3 }}>{panel}</MUI.Container>
      </Shell>
    );
  }

  window.FLS = window.FLS || {};
  window.FLS.mount = () => {
    const root = document.getElementById("root");
    if (!root) throw new Error("No se encontró #root");
    ReactDOM.createRoot(root).render(<App />);
  };
  window.FLS.mount();
})();
