/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, Backbone:true, _:true, XM:true, XT:true*/


_ = require("underscore");
require('../../node-datasource/xt/foundation/foundation');
require('../../node-datasource/xt/database/database');
if (typeof XT === 'undefined') {
  XT = {};
}
require('../../node-datasource/lib/ext/datasource');
if (!X.options) {
  X.options = {};
  X.options.datasource = {};
}

(function () {
  "use strict";

  /**
    Bridge to node-datasource datasource
   */
  exports.runQuery = function (query, creds, callback) {
    console.log("run it");
    //console.log(query, creds);
    XT.dataSource.query(query, creds, function (err, res) {
      callback(err, res);
    });
  };

}());
