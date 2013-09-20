/*jshint node:true, bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, _:true, issue:true */

(function () {
  "use strict";

 /**
  Functionality for dealing with postgres

  @class
  @extends X.Object
 */
  X.Database = X.Object.extend(/** @lends X.Database */{
    poolSize: X.options && X.options.datasource && (typeof X.options.datasource.pgPoolSize !== 'undefined') ? X.options.datasource.pgPoolSize : 1,
    className: "X.Database",
    cleanupCompletedEvent: "cleanupCompleted",

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
