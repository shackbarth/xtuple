/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global */

(function () {
  "use strict";

  var _path = require("path"),
      flag,
      cwd,
      path;

  cwd = process.cwd();

  if ((flag = process.argv.indexOf("-c")) > 0) {
    var configPath = process.argv[flag + 1];
    if (configPath[0] === '/') {
      path = configPath;
    } else {
      path = _path.join(cwd, process.argv[flag + 1]);
    }
  } else {
    path = _path.join(cwd, "config.js");
  }

  module.exports = require(path);
}());
