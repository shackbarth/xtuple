/*globals BT require __dirname */

var path = require('path');

module.exports = BT.Framework.create({
  "frameworks": "xt-foundation".w(),
  sourceTree: path.join(__dirname, ".."),
  // loadPackagesAsCore: true,
  "xt-foundation": require('../../xt/node/buildfile'),
});
