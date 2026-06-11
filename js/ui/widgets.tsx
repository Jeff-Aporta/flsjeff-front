/* ui/widgets — ícono, switches (tema, local/online), util de tamaño. */
(function () {
  "use strict";
  const React = (window as any).React;
  const MUI = (window as any).MaterialUI;
  const w = window as any;

  function Icon(props: { icon: string; size?: number; style?: any }) {
    return React.createElement("iconify-icon", {
      icon: props.icon, style: Object.assign({ fontSize: props.size || 20, verticalAlign: "middle" }, props.style),
    });
  }
  function ThemeSwitch(props: { mode: string; onToggle: () => void }) {
    return React.createElement(MUI.Tooltip, { title: props.mode === "dark" ? "Claro" : "Oscuro" },
      React.createElement(MUI.IconButton, { color: "inherit", size: "small", onClick: props.onToggle },
        React.createElement(Icon, { icon: props.mode === "dark" ? "mdi:weather-sunny" : "mdi:weather-night" })));
  }
  function TargetSwitch() {
    const [local, setLocal] = React.useState(w.FLS.Config.isLocal());
    React.useEffect(() => {
      const f = () => setLocal(w.FLS.Config.isLocal());
      window.addEventListener(w.FLS.Config.EVENT, f);
      return () => window.removeEventListener(w.FLS.Config.EVENT, f);
    }, []);
    return React.createElement(MUI.Tooltip, { title: "API: " + w.FLS.Config.label() },
      React.createElement(MUI.Chip, {
        size: "small", color: local ? "warning" : "primary", variant: "outlined",
        icon: React.createElement(Icon, { icon: local ? "mdi:laptop" : "mdi:cloud-outline", size: 16 }),
        label: local ? "local" : "online", onClick: () => w.FLS.Config.setLocal(!local), sx: { cursor: "pointer" },
      }));
  }
  function humanSize(bytes: number): string {
    if (!bytes && bytes !== 0) return "-";
    const u = ["B", "KB", "MB", "GB"]; let i = 0; let n = bytes;
    while (n >= 1024 && i < u.length - 1) { n /= 1024; i++; }
    return n.toFixed(n < 10 && i > 0 ? 1 : 0) + " " + u[i];
  }
  w.FLS = w.FLS || {};
  w.FLS.UI = { Icon, ThemeSwitch, TargetSwitch, humanSize };
})();
