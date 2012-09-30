(function () {
  var h = window.DOCUMENT_HOSTNAME = document.location.hostname;
  window.relocate = function () {document.location = "https://%@/login".f(h)};
}());