/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, XT:true */

(function () {
  "use strict";

  /**
    Can be called by websockets, or the below fetch function, or REST, etc.
   */
  var fetchEngine = function (payload, callback) {
    var organization,
      query,
      options;

    // TODO: authenticate
    // TODO: replace with REST eventually. Or maybe REST will call this?

    if (payload && payload.databaseType === 'global') {
      // run this query against the global database

      options = JSON.parse(JSON.stringify(payload)); // clone
      //options.username = GLOBAL_USERNAME; // TODO
      options.success = function (resp) {
        callback(null, resp);
      };
      options.error = function (model, err) {
        callback(err);
      };
      XT.dataSource.fetch(options);

    } else {
      // run this query against an instance database

      //payload.username = INSTANCE_USERNAME; // TODO
      //organization = INSTANCE_ORGANIZATION; // TODO
      query = "select xt.fetch('%@')".f(JSON.stringify(payload));
      X.database.query(organization, query, callback);
    }
  };
  exports.fetchEngine = fetchEngine;

  /**
    Accesses the fetchEngine (above) for a GET request a la Express
   */
  exports.fetch = function (req, res) {
    var callback = function (err, resp) {
      if (err) {
        res.send(500, {data: err});
      } else {
        res.send({data: resp});
      }
    };
    fetchEngine(req.query, callback);
  };

}());

