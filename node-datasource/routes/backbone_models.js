/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, _:true, SYS:true */

(function () {
  "use strict";

  var discovery = require("./restDiscovery"),
    DiscoveryBackbone = require('google-discovery-backbone');

  /**
   Returns model descriptions in JSON form to be parsed on the browser by sails-backbone into
   BackboneRelational models.

   https://hostname/databasename/backbone-models                // returns all resources
   https://hostname/databasename/backbone-models/Honorific      // returns one resource
   */
  exports.getModelJson = function (req, res) {
    var payloadUrl = "https://" + req.headers.host + "/"; // TODO get rootURL

    // TODO: use caching like the main restDiscovery route does
    discovery.getRestEngine(req.params.model, payloadUrl, req.params.org, function (result) {
      console.log(result);
      DiscoveryBackbone.generate(result)
        .then(function (orm) {
          res.send(orm);
        });
    });
  };
}());
