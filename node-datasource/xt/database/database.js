/*jshint node:true, bitwise:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, _:true, issue:true */

(function () {
  "use strict";

  var _ = X._;

 /**
  Functionality for dealing with postgres

  @class
  @extends X.Object
 */
  X.Database = X.Object.extend(/** @lends X.Database */{
    poolSize: 12,
    className: "X.Database",
    cleanupCompletedEvent: "cleanupCompleted",

    /**
      Returns postgres connection string

      @param {Object} options optional parameters
      @param {String} options.password postgres password
    */
    conString: function (options) {
      options.password = options.password ? options.password.pre(":"): "";
      return "tcp://{user}{password}@{hostname}:{port}/{database}".f(options);
    },

    /**
      Perform query

      @param {String} query
      @param {Object} options
      @param {Function} callback
     */
    query: function (query, options, callback) {
      var str = this.conString(_.clone(options));
      X.pg.connect(str, _.bind(this.connected, this, query, options, callback));
    },

    /**
      Connected.
    */
    connected: function (query, options, callback, err, client, ranInit) {
      if (err) {
        issue(X.warning("Failed to connect to database: " +
          "{hostname}:{port}/{database} => %@".f(options, err.message)));
        return callback(err);
      }
      if (ranInit === true) { client.hasRunInit = true; }
      if (!client.hasRunInit) {
        client.query("set plv8.start_proc = \"xt.js_init\";", _.bind(
          this.connected, this, query, options, callback, err, client, true));
      } else {
        client.query(query, callback);
      }
    },

    /**
      Initializes database by setting the default pool size
     */
    init: function () {
      X.addCleanupTask(_.bind(this.cleanup, this), this);
      X.pg.defaults.poolSize = this.poolSize;
    },

    /**
      Waits for database pool to drain and finishes cleanup

     */
    cleanup: function () {
      X.log("Waiting for database pool to drain");
      if (X.pg) { X.pg.end(); }
      this.emit(this.cleanupCompletedEvent);
    }
  });
}());
