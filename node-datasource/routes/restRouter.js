/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, _:true */

(function () {
  "use strict";

  exports.router = function (req, res, next) {
    var id,
        model,
        relation,
        relid;

    //  Get the model id from this req URI.
    if (req.params.model && req.params.id) {
      id = req.params.id;
    }

    // TODO - May not need relations at all.
    // Get the relation id from this req URI.
    if (req.params.model && req.params.id && req.params.relation && req.params.relid) {
      relid = req.params.relid;
    }

    _.each(req.authInfo.orm, function (value, key, list) {
      // Find the matching model from this req URI.
      if (req.params.model && value && value.orm_namespace && value.orm_type
        && req.params.model === value.orm_type.camelToHyphen()) {
        model = value.orm_namespace + "." + value.orm_type;
      }

      // TODO - May not need relations at all.
      // Find the matching relation model from this req URI.
      if (req.params.model && req.params.id && req.params.relation && value && value.orm_namespace
        && value.orm_type && req.params.relation === value.orm_type.camelToHyphen()) {
        relation = value.orm_namespace + "." + value.orm_type;
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
        return res.send('REST API GET call to model: ' + model);
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

    //res.send('OAuth 2.0 Server');
    //res.json({ id: req.user.id, name: req.user.get("properName"), scope: req.authInfo.scope });
  };

}());
