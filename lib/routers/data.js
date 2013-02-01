/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

(function () {
  "use strict";

  /**
   Defines the available data routes. Available routes are
   {@link X.dataRoute}, {@link X.authRoute}, {@link X.selectionRoute},
   and {@link X.sessionRoute}.

   @extends X.Router
   @class
   */
  X.dataRouter = X.Router.create({
    routes: [
      X.authRoute,
      X.dataRoute,
      X.dataFromKeyRoute,
      X.exportRoute,
      X.reportRoute,
      X.fileRoute,
      X.oauth2authRoute,
      X.oauth2tokenRoute,
      X.redirectRoute,
      X.selectionRoute,
      X.sessionRoute,
      X.maintenanceRoute
    ]
  });
}());
