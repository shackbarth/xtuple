/*jshint node:true, bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global issue:true, X:true */

(function () {
  'use strict';

  var dataSource = require('../ext/datasource.js').api;

  X.log('spawned pg worker with id ' + process.getuid());

  /**
   * Handle query request from the main thread.
   */
  process.on('message', function (message) {
    X.pg.connect(message.creds, dataSource.connected.bind(
      dataSource, message.query, message.options,
      function (err, result) {
        process.send({err: err, id: message.id, result: result});
      })
    );
  });
})();
