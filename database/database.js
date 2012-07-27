/*jshint node:true, bitwise:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true, issue:true */

(function () {
  "use strict";
  
  var _ = XT._;
  
  XT.Database = XT.Object.extend({
    poolSize: 12,
    className: "XT.Database",
    cleanupCompletedEvent: "cleanupCompleted",
    conString: function (options) {
      options.password = options.password? options.password.pre(":"): "";
      return "tcp://{user}{password}@{hostname}:{port}/{database}".f(options);
    },
    query: function (query, options, callback) {
      var str = this.conString(options);
      XT.pg.connect(str, _.bind(this.connected, this, query, options, callback));
    },
    connected: function (query, options, callback, err, client, ranInit) {
      if (err) {
        issue(XT.warning("Failed to connect to database: " +
          "{hostname}:{port}/{database}".f(options)));
        return callback(err);
      }
      if (ranInit === true) client.hasRunInit = true;
      if (!client.hasRunInit) {
        client.query("set plv8.start_proc = \"xt.js_init\";", _.bind(
          this.connected, this, query, options, callback, err, client, true));
      } else client.query(query, callback);
    },
    init: function () {
      XT.addCleanupTask(_.bind(this.cleanup, this), this);
      XT.pg.defaults.poolSize = this.poolSize;
    },
    cleanup: function () {
      XT.log("Waiting for database pool to drain");
      if (XT.pg) XT.pg.end();
      this.emit(this.cleanupCompletedEvent);
    }
  });
}());