#!/usr/bin/env node

(function () {
  "use strict";

  var init = require("./lib/xvows_init");
  init.parseArgs();
  //init.parseArgs({user: "dev", password: "dev"});
  init.initAll();

}());
