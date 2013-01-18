/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

(function () {
  "use strict";

  exports.fetch = function (req, res) {
    var organization,
      payload = req.query,
      options;

    // TODO: authenticate
    // TODO: replace with REST eventually. Or maybe REST will call this?

    if (payload && payload.databaseType === 'global') {
      // run this query against the global database

      options = JSON.parse(JSON.stringify(payload)); // clone
      //options.username = GLOBAL_USERNAME; // TODO
      options.success = function (resp) { callback(null, resp); };
      options.error = function (model, err) { callback(err); };
      XT.dataSource.fetch(options);

    } else {
      // run this query against an instance database

      //payload.username = INSTANCE_USERNAME; // TODO
      //organization = INSTANCE_ORGANIZATION; // TODO
      query = "select xt.fetch('%@')".f(JSON.stringify(payload));
      X.database.query(organization, query, function (err, res) {
        if (err) {
          res.send(500, { data: err });
        } else {
          res.send({ data: res });
        }
      });
    }
  };
}());

