/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, XT:true */

(function () {
  "use strict";

  var commitEngine = function (payload, callback) {
    var organization,
      query,
      binaryField = payload.binaryField,
      buffer,
      binaryData,
      options;

    // TODO: authenticate

    // we need to convert js binary into pg hex (see the file route for
    // the opposite conversion). see issue 18661
    if (binaryField) {
      binaryData = payload.dataHash[binaryField];
      buffer = new Buffer(binaryData, "binary"); // XXX uhoh: binary is deprecated but necessary here
      binaryData = '\\x' + buffer.toString("hex");
      payload.dataHash[binaryField] = binaryData;
    }

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

      if (!payload.dataHash) {
        callback({message: "Invalid Commit"});
        return;
      }
      // Passing payload through, but trick dataSource into thinking it's a Model:
      payload.changeSet = function () { return payload.dataHash; };
      options.force = true;
      XT.dataSource.commitRecord(payload, options);

    } else {
      // run this query against an instance database

      //payload.username = INSTANCE_USERNAME; // TODO
      //organization = INSTANCE_ORGANIZATION; // TODO
      query = "select xt.commit_record($$%@$$)".f(JSON.stringify(payload));
      X.database.query(organization, query, callback);
    }
  };
  exports.commitEngine = commitEngine;

  var dispatchEngine = function (payload, callback) {
    var organization,
      query,
      options;

    // TODO: authenticate

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
      XT.dataSource.dispatch(payload.className, payload.functionName, payload.parameters, options);

    } else {
      // run this query against an instance database

      //payload.username = INSTANCE_USERNAME; // TODO
      //organization = INSTANCE_ORGANIZATION; // TODO
      query = "select xt.dispatch('%@')".f(JSON.stringify(payload));
      X.database.query(organization, query, callback);
    }
  };
  exports.dispatchEngine = dispatchEngine;

  /**
    Can be called by websockets, or the below fetch function, or REST, etc.
   */
  var fetchEngine = function (payload, callback) {
    var organization,
      query,
      options;

    // TODO: authenticate

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

  var routeAdapter = function (req, res, engineFunction) {
    var callback = function (err, resp) {
      if (err) {
        res.send(500, {data: err});
      } else {
        res.send({data: resp});
      }
    };
    engineFunction(req.query, callback);
  };

  /**
    Accesses the commitEngine (above) for a request a la Express
   */
  exports.commit = function (req, res) {
    routeAdapter(req, res, commitEngine);
  };

  /**
    Accesses the dispatchEngine (above) for a request a la Express
   */
  exports.dispatch = function (req, res) {
    routeAdapter(req, res, dispatchEngine);
  };

  /**
    Accesses the fetchEngine (above) for a request a la Express
   */
  exports.fetch = function (req, res) {
    routeAdapter(req, res, fetchEngine);
  };


}());

