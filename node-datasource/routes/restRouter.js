/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, _:true */

(function () {
  "use strict";

  var routes = require('./routes');

  var getIsRestORMs = function (req, res, next) {
    var callback = {},
        payload = {},
        session = {};

    callback = function (result) {
      if (result.isError) {
        return next(new Error("Invalid Request."));
      }

      routeCall(req, res, next, result.data);
    };

    payload.nameSpace = "XT";
    payload.type = "Discovery";
    payload.dispatch = {
      functionName: "getIsRestORMs",
      isJSON: true
    };

    // Dummy up session.
    session.passport = {
      "user": {
        "id": req.user.get("user"),
        "username": req.user.get("username"),
        "organization": req.user.get("name")
      }
    };

    routes.postEngine(payload, session, callback);
  };

  var routeCall = function (req, res, next, orms) {
    var id,
        model,
        payload = {},
        session = {},
        callback = function (resp, err) {
          if (err) {
            // TODO - Better error handling.
            return res.send(500, {data: err});
          } else {
            return res.send(resp.data.data);
          }
        };

    //  Get the model id from this req URI.
    if (req.params.model && req.params.id) {
      id = req.params.id;
    }

    _.each(orms, function (value, key, list) {
      // Find the matching model from this req URI.
      if (req.params.model && value && value.orm_namespace && value.orm_type &&
          req.params.model === value.orm_type.camelToHyphen()) {
        // TODO - Do we need to include "XM" in the name?
        model = value.orm_type;
      }
    });

    if (!model) {
      return next(new Error("Invalid REST Request."));
    } else {
      switch (req.method) {
      case "DELETE":
        // Deletes the specified resource.
        // TODO - call delete method.
        return res.send('REST API DELETE call to model: ' + model);
      case "GET":
        // Requests a representation of the specified resource.
        // TODO - call get method.

        payload.nameSpace = "XM";
        payload.type = model;
        payload.id = id - 0; // TODO get rootURL

        // Dummy up session.
        // TODO - get user and org from token.
        session.passport = {
          "user": {
            "id": req.user.get("user"),
            "username": req.user.get("username"),
            "organization": req.user.get("name")
          }
        };

        routes.getEngine(payload, session, callback);

        //return res.send('REST API GET call to model: ' + model);
        break;
      case "HEAD":
        // Asks for the response identical to the one that would correspond to a GET request, but without the response body.
        // This is useful for retrieving meta-information written in response headers, without having to transport the entire content.
        // TODO - call head method.
        return res.send(); // HEAD doesn't send a body.
      case "OPTIONS":
        // Returns the HTTP methods that the server supports for specified URL.
        // This can be used to check the functionality of a web server by requesting '*' instead of a specific resource.
        // TODO - call options method.
        return res.send('REST API OPTIONS call to model: ' + model);
      case "PATCH":
        // Is used to apply partial modifications to a resource.
        // TODO - call patch method.
        return res.send('REST API PATCH call to model: ' + model);
      case "POST":
        // Requests that the server accept the entity enclosed in the request as a new subordinate of the web resource identified by the URI.
        // TODO - call post method.
        return res.send('REST API POST call to model: ' + model);
      case "PUT":
        // Requests that the enclosed entity be stored under the supplied URI.
        // TODO - call put method.
        return res.send('REST API does not support PUT calls at this time.');
      default:
        return next(new Error("Invalid REST Request."));
      }
    }
  };

  exports.router = [getIsRestORMs];

}());
