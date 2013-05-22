/*jshint node:true, bitwise:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
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

  var that = this;

  if (err) {
    issue(X.warning("Failed to connect to database: " +
      "{hostname}:{port}/{database} => %@".f(options, err.message)));
    done();
    return process.send({err: err, id: id, options: options});
  }

  if (ranInit === true) {
    client.hasRunInit = true;

    // Register error handler to log errors.
    // TODO - Not sure if setting that.activeQuery below is getting the right query here.
    client.connection.on('error', function (msg) {
      console.log("Database Error! Last query was: ", that.activeQuery);
      console.log("Database Error! DB message was: ", msg);
    });
  }

  if (!client.hasRunInit) {
    client.query("set plv8.start_proc = \"xt.js_init\";", _.bind(
      connected, this, query, options, id, err, client, done, true));
  } else {
    client.query(query, function (err, result) {
      if (err) {
        // Set activeQuery for error event handler above.
        that.activeQuery = client.activeQuery ? client.activeQuery.text : 'unknown. See PostgreSQL log.';
      }

      // Release the client from the pool.
      done();

      // Call the call back.
      process.send({err: err, id: id, result: result});
    });
  }
};

process.on('message', function (message) {
  "use strict";

  var conString = message.conString,
      id = message.id,
      options = message.options,
      poolSize = message.poolSize,
      query = message.query;

  pg.defaults.poolSize = poolSize;

  pg.connect(conString, _.bind(connected, this, query, options, id));
});
