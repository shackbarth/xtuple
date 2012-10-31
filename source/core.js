(function () {
  var h = window.DOCUMENT_HOSTNAME = document.location.hostname;
  window.relocate = function () {
    if (window.onbeforeunload) {
      // if we've set up a "are you sure you want to leave?" warning, disable that
      // here. Presumably we've already asked if they want to leave.
      // delete window.onbeforeunload; // doesn't work
      window.onbeforeunload = undefined;
    }
    document.location = "https://%@/login".f(h)
  };
}());
