#!/usr/bin/env node

(function () {
  "use strict";

  var init = require("./lib/xvows_init");
  init.parseArgs(/*{user: "dev", password: "dev"}*/);
  init.initAll();

/*
The node script in Jenkins looks like this:

  var init = require("../git/client/vows/lib/xvows_init");
  init.parseArgs({user: "dev", password: "dev", tests: "address.js"});

  X.basePath = "/home/shackbarth/Devel/git/client/vows";
  XVOWS.statusCallback = function (status) {
    var brokenVows = _.reduce(status, function (memo, status) {
      return memo + status.total - status.honored;
    }, 0);

    //console.log("Status is", status);
    //console.log("Broken vow count", brokenVows);

    // exit 0 if no broken vows, 1 otherwise
    // XXX: this pre-empts the node-xt cleanup process
    // on shutdown, but that process only returns exit
    // code 0
    process.exit(Math.min(brokenVows, 1));
  }
  init.initAll();

*/

}());
