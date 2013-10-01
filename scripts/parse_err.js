var fs = require("fs");
var _ = require("underscore");

var contents = require("./err.txt").errs;
console.log(contents.length);
_.each(contents, function (err) {
  if (!err[4]) {
    console.log('"_xtdb_' + err[0] + (-1 * err[1]) + '":, "' + err[2] + '",');
    var output = {
      fromFunction: err[0],
      fromId: err[1],
      toFunction: err[4],
      toId: err[3]
    };
  }
});
