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

    payload.className = "XT.Discovery";
    payload.functionName = "getList";
    payload.isJSON = true;
    payload.parameters = [model, "https://mobile.xtuple.com/"]; // TODO get rootURL

    // Dummy up session. This is a public call.
    session.passport = {
      "user": {
        "id": "admin",
        "username": "admin",
        "organization": req.params.org
      }
    };

    routes.dispatchEngine(payload, session, callback);
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

      res.json(result.data);
    };

    if (!req.params.org) {
      return next(new Error("Invalid Request."));
    }

    if (req.params.model) {
      model = req.params.model.camelize().capitalize();
    }

    payload.className = "XT.Discovery";
    payload.functionName = "getDiscovery";
    payload.isJSON = true;
    payload.parameters = [model, "https://mobile.xtuple.com/"]; // TODO get rootURL

    // Dummy up session. This is a public call.
    session.passport = {
      "user": {
        "id": "admin",
        "username": "admin",
        "organization": req.params.org
      }
    };

    routes.dispatchEngine(payload, session, callback);
  };

}());
