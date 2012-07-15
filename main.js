/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true */

(function () {
  "use strict";

  var options = require("./lib/options");

  // include the XT framework
  require("xt");

  // make absolutely sure we're going to start
  options.autoStart = true;

  // set the options
  XT.setup(options);

  // load up the dataserver
  require("./lib/dataserver");

}());