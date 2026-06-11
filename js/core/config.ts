/* core/config — base de la API flsjeff: switch local (wrangler dev) / online (workers.dev). */
(function () {
  "use strict";
  const LOCAL = "http://localhost:8787";
  // Se actualiza con la URL real del Worker tras el primer deploy:
  const ONLINE = "https://flsjeff.jeffaporta.workers.dev";
  const LS = "flsjeff:local";
  const EVT = "flsjeff:target";

  function isLocal(): boolean {
    try { return localStorage.getItem(LS) === "1"; } catch (e) { return false; }
  }
  function setLocal(on: boolean): void {
    try { localStorage.setItem(LS, on ? "1" : "0"); } catch (e) {}
    window.dispatchEvent(new Event(EVT));
  }
  function base(): string { return (isLocal() ? LOCAL : ONLINE).replace(/\/$/, ""); }
  function apiUrl(path: string): string { return base() + (path.charAt(0) === "/" ? path : "/" + path); }
  function label(): string { return isLocal() ? "local :8787" : "online"; }

  const w = window as any;
  w.FLS = w.FLS || {};
  w.FLS.Config = { isLocal, setLocal, base, apiUrl, label, EVENT: EVT, ONLINE, LOCAL };
})();
