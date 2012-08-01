/*jshint node:true, bitwise:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true, issue:true */

(function () {
  "use strict";
  
  var _ = XT._, _http = XT.http;
  
  XT.proxy = XT.Object.create({
    port: 9000,
    hostname: "localhost",
    init: function () {
      if (XT.options.proxy) this.mixin(XT.options.proxy);
    },
    lookup: function (target, payload, callback) {
      var req, options = {
        host: this.get("hostname"),
        port: this.get("port"),
        path: "/lookup/%@".f(target),
        method: "POST"
      };
      req = _http.request(options, _.bind(this.didLookup, this, callback));
      req.on("error", _.bind(this.didError, this, callback));
      payload = XT.typeOf(payload) !== XT.T_STRING? XT.json(payload): payload;
      req.write(payload);
      req.end();
    },
    didLookup: function (callback, res) {
      var data = "";
      res.on("data", function (chunk) { data += chunk; });
      res.on("end", function () { callback(null, XT.json(data)); });      
    },
    didError: function (callback, err) {
      XT.warn("proxy error: ", err);
      callback(err);
    },
    className: "XT.Proxy"
  });
}());