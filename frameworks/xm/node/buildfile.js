/*globals BT require __dirname */

var path = require('path');

module.exports = BT.Framework.create({
  "frameworks": "xt-foundation xbo".w(),
  sourceTree: path.join(__dirname, ".."),

  "xt-foundation": require('../frameworks/foundation/node/buildfile'),
  "xbo": require('../frameworks/xbo/node/buildfile')
});
