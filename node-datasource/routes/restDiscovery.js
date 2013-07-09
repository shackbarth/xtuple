/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, _:true */

(function () {
  "use strict";

  var routes = require('./routes');

  exports.list = function (req, res, next) {
    var callback = {},
        model = null,
        payload = {},
        session = {};

    callback = function (result) {
      if (result.isError) {
        return next(new Error("Invalid Request."));
      }

      res.json(result.data);
    };

    if (!req.params.org) {
      return next(new Error("Invalid Request."));
    }

    if (req.query.name) {
      model = req.query.name.camelize().capitalize();
    }

    payload.nameSpace = "XT";
    payload.type = "Discovery";
    payload.dispatch = {
      functionName: "getList",
      isJSON: true,
      parameters: [model, "https://" + req.headers.host + "/"] // TODO get rootURL
    };

    // Dummy up session. This is a public call.
    session.passport = {
      "user": {
        "id": "admin",
        "username": "admin",
        "organization": req.params.org
      }
    };

    routes.queryDatabase("post", payload, session, callback);
  };

  exports.getRest = function (req, res, next) {
    var callback = {},
        model = null,
        payload = {},
        session = {};

    callback = function (result) {
      if (result.isError) {
        return next(new Error("Invalid Request."));
      }

      // The discovery doc should be cacheable. A "Vary: " header will break that.
      // See: http://code.google.com/p/google-api-php-client/source/browse/tags/0.6.2/src/io/Google_CacheParser.php#100
      delete res._headers.vary;
      res.json(result.data);
    };

    if (!req.params.org) {
      return next(new Error("Invalid Request."));
    }

    if (req.params.model) {
      model = req.params.model.camelize().capitalize();
    }

    payload.nameSpace = "XT";
    payload.type = "Discovery";
    payload.dispatch = {
      functionName: "getDiscovery",
      isJSON: true,
      parameters: [model, "https://" + req.headers.host + "/"] // TODO get rootURL
    };

    // Dummy up session. This is a public call.
    session.passport = {
      "user": {
        "id": "admin",
        "username": "admin",
        "organization": req.params.org
      }
    };

    routes.queryDatabase("post", payload, session, callback);
  };

}());
