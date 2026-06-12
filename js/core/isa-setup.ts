/* Registro ISAFront — API vía main-orchestrator (URL en front-shared/constants.js). */
(function () {
  "use strict";
  window.ISAFront.registerApp({
    ns: "FLS",
    app: "flsjeff-front",
    theme: { lsKey: "flsjeff:theme" },
    widgets: { targetStyle: "chip" },
    loginGate: {
      mode: "redirect",
      redirectMessage: "Debe iniciar sesión con su usuario de la organización para subir archivos.",
    },
  });
})();
