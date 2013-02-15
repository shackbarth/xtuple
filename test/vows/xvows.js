#!/usr/bin/env node

(function () {
  "use strict";

  var init = require("./lib/xvows_init");
  init.parseArgs(/*{user: "dev", password: "dev"}*/);
  init.initAll();

/*
The node script in Jenkins looks like this:

  var init = require("/home/shackbarth/Devel/git/client/test/vows/lib/xvows_init");
  init.parseArgs({user: "dev", password: "dev"});

  X.basePath = "/home/shackbarth/Devel/git/client/test/vows";
  XVOWS.statusCallback = function (status) {
    var brokenVows = _.reduce(status, function (memo, status) {
      return memo + status.total - status.honored;
    }, 0);

    console.log("Status is", status);
    console.log("Broken vow count", brokenVows);

  }
  init.initAll();

*/

}());
