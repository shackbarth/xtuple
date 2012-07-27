/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true */

(function () {
  "use strict";
  
  var _fs = XT.fs, _path = XT.path, salt, crypt;
  
  XT.selectionRoute = XT.Route.create({
    handle: function (xtr) {
      var data = xtr.get("payload"), K = this.get("model"), session, loc;
      loc = "https://%@/client".f(xtr.get("request").headers.host || "localhost");
      
      XT.debug("XT.selectionRoute.handle(): ", data);
      
      session = XT.Session.create(data);
      session.once("isReady", function () {
        XT.debug("XT.selectionRoute.handle.session.isReady(): ", session.get("details"));
        xtr.write(XT.mixin(session.get("details"), {loc: loc})).close();
      });
      session.on("error", function () {
        xtr.error(session.get("error"));
      });
    },
    model: function () {
      return XT.userCache.model("User");
    }.property(),
    handles: "login/selection /login/selection".w(),
    needsSession: false
  });
}());

