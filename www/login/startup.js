
function startup() {
  var c = enyo.getCookie("xtsessioncookie"), validate;
  validate = function (session) {
    var h, x = new enyo.Ajax({
      url: "/session",
      method: "POST"
    });
    x.go(session);
    x.response(function (ignore, res) {
      //console.log("validation: ", res);
      if (res && res.code && res.code === 1) {
        h = document.location.hostname;
        document.location = "https://" + h + "/client";
      } else app.start();
    });
  };
  if (!c) app.start();
  else validate(c);
}