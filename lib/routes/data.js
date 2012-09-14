/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

(function () {
  "use strict";

  var _ = X._;

  /**
    Defines the data route.

    @extends X.Route
    @class
   */
  X.dataRoute = X.Route.create({

    handle: function (xtr) {
      var path, handler, session;

      path = xtr.get("requestType");
      handler = this.find(path);

      if (!handler) {
        xtr.error("Could not handle %@".f(path));
      } else {
        if (handler.needsSession) session = X.Session.create(xtr.get("data"));
        handler.handle(xtr, session);
      }
    },

    find: function (path) {
      var ret = X.functorMap[path];
      //console.log("find(): ", Object.keys(X.functorMap));
      return ret;
    },

    handles: "data /data".w()
  });
}());
