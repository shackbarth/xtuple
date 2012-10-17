#!/usr/bin/env node

require("../xt");

var options = {
  processName: "node-xt-test",
  pidFileName: "testing",
  debugging: true,
  autoStart: true
}

X.setup(options);

X.debug("All Done With Tests");