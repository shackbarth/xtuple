/*globals BT require __dirname */

var path = require('path');

module.exports = BT.Framework.create({

  sourceTree: path.join(__dirname, ".."),
  usePackages: true

});
