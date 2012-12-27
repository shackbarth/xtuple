#!/usr/bin/env node

(function () {
  "use strict";

  var init = require("./lib/xvows_init");
  init.parseArgs(/*{user: "dev", password: "dev"}*/);
  init.initAll();

/*
The node script in Jenkins looks like this:

var init = require(process.cwd() + "/../../../../Devel/git/client/vows/lib/xvows_init");
init.parseArgs({user: "dev", password: "dev"});
X.basePath = "/home/shackbarth/Devel/git/client/vows";
init.initAll();
*/

}());
