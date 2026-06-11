/* Registro ISAFront — config, auth, tema, widgets (jsDelivr). */
(function () {
  "use strict";
  window.ISAFront.registerApp({
    ns: "FLS",
    api: {
      local: "http://localhost:8782",
      online: "https://flsjeff.jeffaporta.workers.dev",
      lsKey: "flsjeff:local",
      event: "flsjeff:target",
    },
    theme: { lsKey: "flsjeff:theme" },
    widgets: { targetStyle: "chip" },
    loginGate: {
      mode: "redirect",
      redirectMessage: "Debe iniciar sesión con su usuario de la organización para subir archivos.",
    },
  });
})();
