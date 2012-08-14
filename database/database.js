/*jshint node:true, bitwise:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, issue:true */

(function () {
  "use strict";
  
  var _ = X._;
  
  X.Database = X.Object.extend({
    poolSize: 12,
    className: "X.Database",
    cleanupCompletedEvent: "cleanupCompleted",
    conString: function (options) {
      options.password = options.password? options.password.pre(":"): "";
      return "tcp://{user}{password}@{hostname}:{port}/{database}".f(options);
    },
    query: function (query, options, callback) {
      var str = this.conString(_.clone(options));
      X.pg.connect(str, _.bind(this.connected, this, query, options, callback));
    },
    connected: function (query, options, callback, err, client, ranInit) {
      if (err) {
        issue(X.warning("Failed to connect to database: " +
          "{hostname}:{port}/{database} => %@".f(options, err.message)));
        return callback(err);
      }
      if (ranInit === true) client.hasRunInit = true;
      if (!client.hasRunInit) {
        client.query("set plv8.start_proc = \"xt.js_init\";", _.bind(
          this.connected, this, query, options, callback, err, client, true));
      } else client.query(query, callback);
    },
    init: function () {
      X.addCleanupTask(_.bind(this.cleanup, this), this);
      X.pg.defaults.poolSize = this.poolSize;
    },
    cleanup: function () {
      X.log("Waiting for database pool to drain");
      if (X.pg) X.pg.end();
      this.emit(this.cleanupCompletedEvent);
    }
  });
}());
