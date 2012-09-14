/*jshint node:true, bitwise:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, issue:true */

(function () {
  "use strict";

  var _ = X._, _http = X.http;

  /**
   Manages communication with the router (formerly known as proxy)

   @class
   @extends X.Object
   */
  X.proxy = X.Object.create(/** @lends X.proxy */{
    /**
      Port
     */
    port: 9000,

    /**
      Host name
     */
    hostname: "localhost",

    /**
      Initializes proxy by mixing in options if available.
     */
    init: function () {
      if (X.options.proxy) {
        this.mixin(X.options.proxy);
      }
    },

    /**
      Change the password via the router
     */
    changePassword: function (target, payload, callback) {
      var req, options = {
        host: this.get("hostname"),
        port: this.get("port"),
        path: "/%@".f(target), // XXX how to get the ID into here?
        method: "POST"
      };
      req = _http.request(options, _.bind(this.didChangePassword, this, callback));
      req.on("error", _.bind(this.didError, this, callback));
      payload.changePassword = true;
      payload = X.json(payload);
      req.write(payload);
      req.end();
    },
    didChangePassword: function (callback, res) {
      var data = "";
      res.on("data", function (chunk) {
        data += chunk;
      });
      res.on("end", function () {
        var jsonData = X.json(data);
        if (jsonData.isError) {
          callback(jsonData, null);
        } else {
          callback(null, jsonData);
        }
      });
    },
    /**
      Lookup.
     */
    lookup: function (target, payload, callback) {
      var req, options = {
        host: this.get("hostname"),
        port: this.get("port"),
        path: "/%@".f(target),
        method: "POST"
      };
      req = _http.request(options, _.bind(this.didLookup, this, callback));
      req.on("error", _.bind(this.didError, this, callback));
      payload.lookup = true;
      payload = X.json(payload);
      req.write(payload);
      req.end();
    },
    didLookup: function (callback, res) {
      var data = "";
      res.on("data", function (chunk) { data += chunk; });
      res.on("end", function () { callback(null, X.json(data)); });
    },
    didError: function (callback, err) {
      X.warn("proxy error: ", err);
      callback(err);
    },
    className: "X.Proxy"
  });
}());
