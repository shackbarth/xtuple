/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, XT:true */

(function () {
  "use strict";

  // All of the "big 4" routes are in here: get, post, patch and delete
  // They all share a lot of similar code so I've broken out queryDatabase function to reuse code.

  // All of the functions have "engine" functions that do all the work, and then
  // "adapter" functions that call the engines and adapt to the express convention. These
  // adapter functions are also nearly identical so I've reused code there as well.

  // Sorry for the indirection.

  /**
    To query the instance database we pass in a query string to XT.dataSource in a way that's
    very similar for all four operations. We have to massage the client-expected callback
    to fit with the native callback of XT.dataSource.
   */
  var queryDatabase = exports.queryDatabase = function (functionName, payload, session, callback) {
    var exposedFunctions = ["delete", "get", "patch", "post"],
      query,
      queryOptions,
      org,
      queryString = "select xt.%@($$%@$$)",
      binaryField = payload.binaryField,
      buffer,
      binaryData,
      adaptorCallback = function (err, res) {
        var data,
            status;

        if (err) {
          callback({
            isError: true,
            description: err.message,
            debug: err.debug || null,
            status: err.status || {code: 500, message: "Internal Server Error" }
          });
        } else if (res && res.rows && res.rows.length > 0) {
          // the data comes back in an awkward res.rows[0].request form,
          // and we want to normalize that here so that the data is in response.data
          try {
            data = JSON.parse(res.rows[0][functionName]);
          } catch (error) {
            data = {isError: true, status: "Cannot parse data"};
          }
          callback({
            data: data,
            status: res.status,
            debug: res.debug
          });
        } else {
          callback({
            isError: true,
            status: res.status || {code: 500, message: "Internal Server Error"}
          });
        }
      };

    payload.username = session.passport.user.username;
    org = session.passport.user.organization;

    // Make sure functionName is one of the exposed functions.
    if (exposedFunctions.indexOf(functionName) === -1) {
      X.err("Invalid call to unexposed database function: ", functionName);
      callback(true);
    }

    // We need to convert js binary into pg hex (see the file route for
    // the opposite conversion). See issue #18661
    if (functionName === 'post' && binaryField) {
      binaryData = payload.data[binaryField];
      buffer = new Buffer(binaryData, "binary"); // XXX uhoh: binary is deprecated but necessary here
      binaryData = '\\x' + buffer.toString("hex");
      payload.data[binaryField] = binaryData;
    }

    query = queryString.f(functionName, JSON.stringify(payload));
    queryOptions = XT.dataSource.getAdminCredentials(org);
    XT.dataSource.query(query, queryOptions, adaptorCallback);
  };

  /**
    The adaptation of express routes to engine functions is the same for all four operations,
    so we centralize the code here:
   */
  var routeAdapter = function (req, res, functionName) {
    var callback = function (err, resp) {
      if (err) {
        res.send(500, {data: err});
      } else {
        res.send({data: resp});
      }
    };
    queryDatabase(functionName, req.query, req.session, callback);
  };

  /**
    Accesses queryDatabase (above) for a request a la Express
   */
  exports.delete = function (req, res) {
    routeAdapter(req, res, "delete");
  };

  /**
    Accesses queryDatabase (above) for a request a la Express
   */
  exports.get = function (req, res) {
    routeAdapter(req, res, "get");
  };

  /**
    Accesses queryDatabase (above) for a request a la Express
   */
  exports.patch = function (req, res) {
    routeAdapter(req, res, "patch");
  };

  /**
    Accesses queryDatabase (above) for a request a la Express
   */
  exports.post = function (req, res) {
    routeAdapter(req, res, "post");
  };

}());

