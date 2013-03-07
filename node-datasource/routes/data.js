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

  /**
    The options parameter in the XT.dataSource calls to the global database are all
    the same. Notably, we have to massage the client-expected callback to fit into
    the backboney callback system of XT.dataSource.
   */
  var createGlobalOptions = function (payload, globalUsername, callback) {
    var options = JSON.parse(JSON.stringify(payload)); // clone

    options.username = globalUsername;
    options.success = function (resp) {
      callback({data: resp});
    };
    options.error = function (model, err) {
      callback({isError: true, message: err});
    };
    return options;
  };

  /**
    To query the instance database we pass in a query string to X.database in a way that's
    very similar for all four operations. We have to massage the client-expected callback
    to fit with the native callback of X.database.
   */
  var queryInstanceDatabase = function (queryString, functionName, payload, session, callback) {
    var query,
      adaptorCallback = function (err, res) {
        var data;

        if (err) {
          callback({isError: true, error: err, message: err.message});
        } else if (res && res.rows && res.rows.length > 0) {
          // the data comes back in an awkward res.rows[0].dispatch form,
          // and we want to normalize that here so that the data is in response.data
          try {
            data = JSON.parse(res.rows[0][functionName]);
          } catch (error) {
            data = {isError: true, message: "Cannot parse data"};
          }
          callback({data: data});
        } else {
          callback({isError: true, message: "No results"});
        }
      };

    payload.username = session.passport.user.username;
    query = queryString.f(JSON.stringify(payload));
    X.database.query(session.passport.user.organization, query, adaptorCallback);
  };

  /**
    Does all the work of commit.
    Can be called by websockets, or the express route (below), or REST, etc.
   */
  var commitEngine = function (payload, session, callback) {
    var organization,
      query,
      binaryField = payload.binaryField,
      buffer,
      binaryData,
      options;

    // We need to convert js binary into pg hex (see the file route for
    // the opposite conversion). See issue #18661
    if (binaryField) {
      binaryData = payload.dataHash[binaryField];
      buffer = new Buffer(binaryData, "binary"); // XXX uhoh: binary is deprecated but necessary here
      binaryData = '\\x' + buffer.toString("hex");
      payload.dataHash[binaryField] = binaryData;
    }

    if (payload && payload.databaseType === 'global') {
      // Run this query against the global database.
      options = createGlobalOptions(payload, session.passport.user.id, callback);
      if (!payload.dataHash) {
        callback({message: "Invalid Commit"});
        return;
      }
      // Passing payload through, but trick dataSource into thinking it's a Model:
      payload.changeSet = function () { return payload.dataHash; };
      options.force = true;
      XT.dataSource.commitRecord(payload, options);

    } else {
      // Run this query against an instance database.
      queryInstanceDatabase("select xt.commit_record($$%@$$)", "commit_record", payload, session, callback);
    }
  };
  exports.commitEngine = commitEngine;

  /**
    Does all the work of dispatch.
    Can be called by websockets, or the express route (below), or REST, etc.
   */
  var dispatchEngine = function (payload, session, callback) {
    var organization,
      query,
      options;
    if (payload && payload.databaseType === 'global') {
      // Run this query against the global database.
      options = createGlobalOptions(payload, session.passport.user.id, callback);
      XT.dataSource.dispatch(payload.className, payload.functionName, payload.parameters, options);

    } else {
      // Run this query against an instance database.
      queryInstanceDatabase("select xt.dispatch('%@')", "dispatch", payload, session, callback);
    }
  };
  exports.dispatchEngine = dispatchEngine;

  /**
    Does all the work of fetch.
    Can be called by websockets, or the express route (below), or REST, etc.
   */
  var fetchEngine = function (payload, session, callback) {
    var organization,
      query,
      options;

    if (payload && payload.databaseType === 'global') {
      // run this query against the global database
      options = createGlobalOptions(payload, session.passport.user.id, callback);
      XT.dataSource.fetch(options);

    } else {
      // run this query against an instance database
      queryInstanceDatabase("select xt.fetch('%@')", "fetch", payload, session, callback);
    }
  };
  exports.fetchEngine = fetchEngine;

  /**
    Does all the work of retrieve.
    Can be called by websockets, or the express route (below), or REST, etc.
   */
  var retrieveEngine = function (payload, session, callback) {
    var organization,
      query,
      options;

    if (payload && payload.databaseType === 'global') {
      // run this query against the global database
      options = createGlobalOptions(payload, session.passport.user.id, callback);
      XT.dataSource.retrieveRecord(payload.recordType, payload.id, options);

    } else {
      // run this query against an instance database
      queryInstanceDatabase("select xt.retrieve_record('%@')", "retrieve_record", payload, session, callback);
    }
  };
  exports.retrieveEngine = retrieveEngine;

  /**
    The adaptation of express routes to engine functions is the same for all four operations,
    so we centralize the code here:
   */
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
    Accesses the retrieveEngine (above) for a request a la Express
   */
  exports.retrieve = function (req, res) {
    routeAdapter(req, res, retrieveEngine);
  };

}());

