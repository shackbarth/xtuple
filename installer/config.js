/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global */

(function () {
  "use strict";

  module.exports = {
    version: "1.0",
    allowMultipleInstances: true,
    requireDatabase: true,
    requireServer: true,
    orm: {
      port: 9080,
      defaultPath: "../../client/orm"
    },
  };
}());
