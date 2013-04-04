/*jshint node:true, bitwise:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global issue:true */

var pg = require('pg').native;
var _ = require("underscore");

pg.defaults.poolIdleTimeout = 10000;

/**
 * Connected.
 */
var connected = function (query, options, id, err, client, done, ranInit) {
  "use strict";

  if (err) {
    done();
    return process.send({err: err, id: id, options: options});
  }

  if (ranInit === true) {
    client.hasRunInit = true;
  }

  if (!client.hasRunInit) {
    client.query("set plv8.start_proc = \"xt.js_init\";", _.bind(
      connected, this, query, options, id, err, client, done, true));
  } else {
    client.query(query, function (err, result) {
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
