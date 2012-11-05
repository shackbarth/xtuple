#!/usr/bin/env node

/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

(function () {
  "use strict";

  var options = require("./lib/options");

  // include the X framework
  require("xt");

  // make absolutely sure we're going to start
  options.autoStart = true;

  X.debugging = true;

  // set the options
  X.setup(options);
}());
