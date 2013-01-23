/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, XT:true */

(function () {
  "use strict";

  // All of the "big 4" routes are in here: commit, dispatch, fetch, and retrieve
  // They all share a lot of similar code so I've broken out the functions createGlobalOptions
  // and queryInstanceDatabase to reuse code.

  // All of the functions have "engine" functions that do all the work, and then
  // "adapter" functions that call the engines and adapt to the express convention. These
  // adapter functions are also nearly identical so I've reused code there as well.

  // Sorry for the indirection.

  var createGlobalOptions = function (payload, globalUsername, callback) {
    var options = JSON.parse(JSON.stringify(payload)); // clone

    options.username = globalUsername;
    options.success = function (resp) {
      callback(null, resp);
    };
    options.error = function (model, err) {
      callback(err);
    };
  };

  var queryInstanceDatabase = function (queryString, payload, session, callback) {
    var query;

    payload.username = session.passport.username;
    query = queryString.f(JSON.stringify(payload));
    X.database.query(session.passport.organization, query, callback);
  };

  var commitEngine = function (payload, session, callback) {
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

      options = createGlobalOptions(payload, session.passport.user, callback);

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
      queryInstanceDatabase("select xt.commit_record($$%@$$)", payload, session, callback);
    }
  };
  exports.commitEngine = commitEngine;

  var dispatchEngine = function (payload, session, callback) {
    var organization,
      query,
      options;

    // TODO: authenticate

    if (payload && payload.databaseType === 'global') {
      // run this query against the global database

      options = createGlobalOptions(payload, session.passport.user, callback);
      XT.dataSource.dispatch(payload.className, payload.functionName, payload.parameters, options);

    } else {
      // run this query against an instance database
      queryInstanceDatabase("select xt.dispatch('%@')", payload, session, callback);
    }
  };
  exports.dispatchEngine = dispatchEngine;

  /**
    Can be called by websockets, or the below fetch function, or REST, etc.
   */
  var fetchEngine = function (payload, session, callback) {
    var organization,
      query,
      options;

    // TODO: authenticate

    if (payload && payload.databaseType === 'global') {
      // run this query against the global database

      options = createGlobalOptions(payload, session.passport.user, callback);
      XT.dataSource.fetch(options);

    } else {
      // run this query against an instance database
      queryInstanceDatabase("select xt.fetch('%@')", payload, session, callback);
    }
  };
  exports.fetchEngine = fetchEngine;

  /**
    Can be called by websockets, or the below fetch function, or REST, etc.
   */
  var retrieveEngine = function (payload, session, callback) {
    var organization,
      query,
      options;

    // TODO: authenticate

    if (payload && payload.databaseType === 'global') {
      // run this query against the global database

      options = createGlobalOptions(payload, session.passport.user, callback);
      XT.dataSource.retrieveRecord(payload.recordType, payload.id, options);

    } else {
      // run this query against an instance database
      queryInstanceDatabase("select xt.retrieve_record('%@')", payload, session, callback);
    }
  };
  exports.retrieveEngine = retrieveEngine;

  var routeAdapter = function (req, res, engineFunction) {
    var callback = function (err, resp) {
      if (err) {
        res.send(500, {data: err});
      } else {
        res.send({data: resp});
      }
    };
    engineFunction(req.query, req.session, callback);
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

  /**
    Accesses the fetchEngine (above) for a request a la Express
   */
  exports.retrieve = function (req, res) {
    routeAdapter(req, res, retrieveEngine);
  };

}());

