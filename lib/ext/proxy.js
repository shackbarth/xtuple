/*jshint node:true, bitwise:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, issue:true */

(function () {
  "use strict";

  var _ = X._, _http = X.http;

  /**
   Datasource Proxy.

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
      if (X.options.proxy) this.mixin(X.options.proxy);
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
