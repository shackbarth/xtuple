/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true */

(function () {
  "use strict";
  
  var _ = XT._;
  
  XT.logoutRoute = XT.Route.create({
    
    handle: function (xtr) {
      XT.debug("handle(route, logout): ", xtr.get("payload"), xtr.get("data"), XT.typeOf(xtr.get("data")));
      xtr.error("noooo");
      //session = XT.Session.create(xtr.get("payload"));
      //session.once("isReady", _.bind(this.ready, this, session, xtr));
      //session.once("error", _.bind(this.error, this, session, xtr));
    },
    needsSession: false,
    handles: "/logout".w()
  });
}());
