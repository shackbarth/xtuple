/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, XT:true */

(function () {
  "use strict";

  // All of the "big 4" routes are in here: get, post, patch and delete
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
  var createGlobalOptions = function (payload, globalUsername, callback, returnsModel) {
    var options = JSON.parse(JSON.stringify(payload)), // clone
      resp = returnsModel !== false ? 1 : 0;

    options.username = globalUsername;
    options.success = function () {
      callback({data: arguments[resp]});
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
          callback({isError: true, error: err, message: err.message, description: err.message});
        } else if (res && res.rows && res.rows.length > 0) {
          // the data comes back in an awkward res.rows[0].request form,
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
    Does all the work to delete.
    Can be called by websockets, or the express route (below), or REST, etc.
   */
  var deleteEngine = function (payload, session, callback) {
    var options;

    if (payload && payload.databaseType === 'global') {
      // Run this query against the global database.
      options = createGlobalOptions(payload, session.passport.user.id, callback);
      XT.dataSource.request(null, 'delete', payload, options);

    } else {
      // Run this query against an instance database.
      queryInstanceDatabase("select xt.delete($$%@$$)", "delete", payload, session, callback);
    }
  };
  exports.deleteEngine = deleteEngine;

  /**
    Does all the work to get.
    Can be called by websockets, or the express route (below), or REST, etc.
   */
  var getEngine = function (payload, session, callback) {
    var options;

    if (payload && payload.databaseType === 'global') {
      // Run this query against the global database.
      options = createGlobalOptions(payload, session.passport.user.id, callback);
      XT.dataSource.request(null, 'get', payload, options);

    } else {
      // Run this query against an instance database.
      queryInstanceDatabase("select xt.get($$%@$$)", "get", payload, session, callback);
    }
  };
  exports.getEngine = getEngine;

  /**
    Does all the work to patch.
    Can be called by websockets, or the express route (below), or REST, etc.
   */
  var patchEngine = function (payload, session, callback) {
    var options;

    if (payload && payload.databaseType === 'global') {
      // Run this query against the global database.
      options = createGlobalOptions(payload, session.passport.user.id, callback);
      XT.dataSource.request(null, 'patch', payload, options);

    } else {
      // Run this query against an instance database.
      queryInstanceDatabase("select xt.patch($$%@$$)", "patch", payload, session, callback);
    }
  };
  exports.patchEngine = patchEngine;

  /**
    Does all the work to post.
    Can be called by websockets, or the express route (below), or REST, etc.
   */
  var postEngine = function (payload, session, callback) {
    var binaryField = payload.data && payload.data.binaryField,
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
      XT.dataSource.request(null, 'post', payload, options);

    } else {
      // Run this query against an instance database.
      queryInstanceDatabase("select xt.post($$%@$$)", "post", payload, session, callback);
    }
  };
  exports.postEngine = postEngine;

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
    Accesses the deleteEngine (above) for a request a la Express
   */
  exports.delete = function (req, res) {
    routeAdapter(req, res, deleteEngine);
  };

  /**
    Accesses the getEngine (above) for a request a la Express
   */
  exports.get = function (req, res) {
    routeAdapter(req, res, getEngine);
  };

  /**
    Accesses the patchEngine (above) for a request a la Express
   */
  exports.patch = function (req, res) {
    routeAdapter(req, res, patchEngine);
  };

  /**
    Accesses the postEngine (above) for a request a la Express
   */
  exports.post = function (req, res) {
    routeAdapter(req, res, postEngine);
  };

}());

