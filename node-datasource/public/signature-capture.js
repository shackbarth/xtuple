//
// js, html, and css taken mostly from the reference example
// https://github.com/szimek/signature_pad/tree/gh-pages
//
(function () {
  var wrapper = document.getElementById("signature-pad"),
    clearButton = wrapper.querySelector("[data-action=clear]"),
    saveButton = wrapper.querySelector("[data-action=save]"),
    canvas = wrapper.querySelector("canvas"),
    signaturePad;

  // Adjust canvas coordinate space taking into account pixel ratio,
  // to make it look crisp on mobile devices.
  // This also causes canvas to be cleared.
  function resizeCanvas() {
    var ratio =  window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext("2d").scale(ratio, ratio);
  }

  window.onresize = resizeCanvas;
  resizeCanvas();

  signaturePad = new SignaturePad(canvas);

  clearButton.addEventListener("click", function (event) {
    signaturePad.clear();
  });

  saveButton.addEventListener("click", function (event) {
    var callback = function (blob) {
      saveSignature(blob, function () {
        signaturePad.clear();
        clearButton.disabled = true;
        saveButton.disabled = true;
      });
    };
    if (signaturePad.isEmpty()) {
      alert("Please provide signature first.");
    } else {
      signaturePad._canvas.toBlob(callback, "png", true);
    }
  });
}());
