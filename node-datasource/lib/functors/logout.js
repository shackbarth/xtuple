/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

(function () {
  "use strict";
  
  var _ = X._;
  
  X.Functor.create({
    
    handle: function (xtr) {
      var session;
      //X.debug("handle(functor, logout): ", xtr.get("payload"), xtr.get("data"), X.typeOf(xtr.get("data")));
      session = X.Session.create(X.mixin(xtr.get("payload"), {logout: true}));
      session.once("isReady", _.bind(this.ready, this, session, xtr));
      session.once("error", _.bind(this.error, this, session, xtr));
    },
    ready: function (session, xtr) {
      session.removeAllListeners();
      xtr.write({loggedOut: true}).close();
    },
    error: function (session, xtr) {
      session.removeAllListeners();
      xtr.error("could not log out");
    },
    needsSession: false,
    handles: "function/logout".w()
  });
}());
