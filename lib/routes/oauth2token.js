/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, XM:true */

(function () {
  "use strict";

  var _fs = X.fs, _path = X.path;

  /**
    Defines the authentication route.

    @extends X.Route
    @class
   */
  X.oauth2tokenRoute = X.Route.create({
    handle: function (xtr) {
      var data = xtr.get("payload"),
        options = {},
        message = "OAuth 2.0 Token endpoint",
        that = this;

      //X.debugging = true;
      //X.debug(data);

      options.success = function () {
        xtr.write(session.get("details")).close();
      };
      options.error = function (err) {
        xtr.error({isError: true, reason: message});
      };
      //options.id = data.id;
      options.username = X.options.globalDatabase.nodeUsername;
      //user.fetch(options);

      xtr.write(message).close();
    },

    handles: "/oauth2/token".w(),
    needsSession: false
  });
}());
