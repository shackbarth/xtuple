#!/usr/bin/env node

(function () {
  "use strict";

  require("./lib/xt_setup");
  require("./lib/xvows");
  var params = require("./lib/xvows_params");
  exports.xvowsParams = params;
  params.acceptParams("dev", "dev");
  var init = require("./lib/xvows_init");
  init.initAll();

  XVOWS.once("ready", function () {

    XT.dataSource.datasourceUrl = program.host;
    XT.dataSource.datasourcePort = program.port;

    XT.dataSource.connect(function () {
      XT.getStartupManager().registerCallback(_.bind(XVOWS.begin, XVOWS));
    });

  });


}());
