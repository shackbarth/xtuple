#!/usr/bin/env node

(function () {
  "use strict";
  
  var options = require("./lib/options");
  
  require("xt");
  
  options.autoStart = true;
  
  XT.setup(options);
  
  require("./lib/orm");
}());