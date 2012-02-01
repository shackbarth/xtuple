/*globals BT require __dirname */

var path = require('path');

module.exports = BT.Framework.create({
  "frameworks": "xt-foundation plugin table xbo".w(),
  sourceTree: path.join(__dirname, ".."),

  "xt-foundation": require('../frameworks/foundation/node/buildfile'),
  "plugin": require('../frameworks/plugin/node/buildfile'),
  "table": require('../frameworks/table/node/buildfile'),
  "xbo": require('../frameworks/xbo/node/buildfile')
});
