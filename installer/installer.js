#!/usr/bin/env node

(function () {
  "use strict";
  
  var options = require("./lib/options");
  
  require("xt");
  
  options.autoStart = true;
  
  X.setup(options);
  
  require("./lib/orm");
}());
