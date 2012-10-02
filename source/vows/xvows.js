#!/usr/bin/env node

(function () {
  "use strict";

  require("./lib/xt_setup");
  require("./lib/xvows_init");

  XVOWS.once("ready", function () {

    XT.dataSource.datasourceUrl = program.host;
    XT.dataSource.datasourcePort = program.port;

    XT.dataSource.connect(function () {
      XT.getStartupManager().registerCallback(_.bind(XVOWS.begin, XVOWS));
    });

  });

}());