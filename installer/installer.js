#!/usr/bin/env node

(function () {
  "use strict";
  
  var options = require("./lib/options");
  
  require("xt");
  
  options.autoStart = true;
  
  X.setup(options);
  
  require("./lib/orm");
  
  // support for command line is a hack for now...
  require("./lib/cli");
}());
