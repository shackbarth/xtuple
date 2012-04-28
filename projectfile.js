/*globals global require __dirname BT */

require('blossom/buildtools'); // adds the SC and BT namespaces as globals

var path = require('path');

var project = BT.Project.create({

  "postbooks": BT.App.create({
    frameworks: 'blossom xm'.w(),
    sourceTree: path.join(__dirname, 'apps/postbooks')
  }),

  "console": BT.App.create({
    frameworks: 'blossom xm'.w(),
    sourceTree: path.join(__dirname, 'apps/console')
  }),

  "blossom": require('blossom'),

  "xm": require('./frameworks/xm/node/buildfile'),
  "xt": require('./frameworks/xt/node/buildfile'),

});

BT.Server.create({
  hostname: "127.0.0.1",
  //hostname: "192.168.0.128",
  project: project
});
