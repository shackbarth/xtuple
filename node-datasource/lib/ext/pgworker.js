/*jshint node:true, bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global issue:true */

var pg = require('pg');
var _ = require("underscore");

pg.defaults.poolIdleTimeout = 10000;

/**
 * Connected.
 */
var connected = function (query, options, id, err, client, done, ranInit) {
  // WARNING!!! If you make any changes here, please update datasource.js as well.
  "use strict";

  var that = this,
    queryCallback;

  if (err) {
    issue(console.log("pgWorker Failed to connect to database: " +
      "{hostname}:{port}/{database} => %@".f(options, err.message)));
    done();
    return process.send({err: err, id: id, options: options});
  }

  client.status = [];
  client.debug = [];

  if (ranInit === true) {
    client.hasRunInit = true;

    // Register error handler to log errors.
    // TODO - Not sure if setting that.activeQuery below is getting the right query here.
    client.connection.on('error', function (msg) {
      if (msg.message !== "handledError") {
        console.log("Database Error! ", msg.message + " Please fix this!!!");
        _.each(client.debug, function (message) {
          console.log("Database Error! DB message was: ", message);
        });
        console.log("Database Error! Last query was: ", that.activeQuery);
        console.log("Database Error! DB name = ", options.database);
      }
    });

    client.connection.on('notice', function (msg) {
      if (msg && msg.message) {
        if (msg.severity === 'NOTICE') {
          client.status.push(msg.message);
          //console.log("Database notice Message: ", msg.message);
        } else if (msg.severity === 'INFO') {
          client.status.push(msg.message);
          //console.log("Database info Message: ", msg.message);
        } else if (msg.severity === 'WARNING') {
          client.debug.push(msg.message);
          //console.log("Database warning Message: ", msg.message);
        } else if (msg.severity === 'DEBUG') {
          client.debug.push(msg.message);
          //console.log("Database debug Message: ", msg.message);
        }
      }
    });
  }

  if (!client.hasRunInit) {
    //client.query("set plv8.start_proc = \"xt.js_init\";", _.bind(
    client.query("select xt.js_init(" + (options.debugDatabase || false) + ");", _.bind(
      connected, this, query, options, id, err, client, done, true));
  } else {
    queryCallback = function (err, result) {
      if (err) {
        // Set activeQuery for error event handler above.
        that.activeQuery = client.activeQuery ? client.activeQuery.text : 'unknown. See PostgreSQL log.';
      }

      if (client.status && client.status.length) {
        if (result) {
          try {
            result.status = JSON.parse(client.status[0]);
          } catch (error) {
            // Move on, no status message to set. We only want JSON messages here.
          }
        } else if (err) {
          try {
            err.status = JSON.parse(client.status[0]);
          } catch (error) {
            // Move on, no status message to set. We only want JSON messages here.
          }
        } else {
          console.log("### FIX ME ### No result or err returned for query. This shouldn't happen.");
          console.trace("### At this location ###");
        }

        if (client.status.length > 1) {
          try {
            JSON.parse(client.status);
            console.log("### FIX ME ### Database is returning more than 1 message status. This shouldn't happen.");
            console.log("### FIX ME ### Status is: ", JSON.stringify(client.status));
            console.log("### FIX ME ### Query was: ", client.activeQuery ? client.activeQuery.text : 'unknown. See PostgreSQL log.');
            console.trace("### At this location ###");
          } catch (error) {
            // Move on, no status message to set. We only want JSON messages here.
          }
        }
      }
      if (client.debug && client.debug.length) {
        if (result) {
          result.debug = client.debug;
        } else if (err) {
          err.debug = client.debug;
        } else {
          console.log("### FIX ME ### No result or err returned for query. This shouldn't happen.");
          console.trace("### At this location ###");
        }
      }

      // Release the client from the pool.
      done();

      // Call the call back.
      process.send({err: err, id: id, result: result});
    };
    // node-postgres supports parameters as a second argument. These will be options.parameters
    // if they're there.
    if (options.parameters) {
      client.query(query, options.parameters, queryCallback);
    } else {
      client.query(query, queryCallback);
    }

  }
};

process.on('message', function (message) {
  "use strict";

  var creds = message.creds,
      id = message.id,
      options = message.options,
      poolSize = message.poolSize,
      query = message.query;

  pg.defaults.poolSize = poolSize;

  pg.connect(creds, _.bind(connected, this, query, options, id));
});
