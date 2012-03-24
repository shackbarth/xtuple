/*globals global require __dirname BT */

require('blossom/buildtools'); // adds the SC and BT namespaces as globals

var path = require('path');

var project = BT.Project.create({

  "postbooks": BT.App.create({
    frameworks: 'blossom xm xt'.w(),
    sourceTree: path.join(__dirname, 'apps/postbooks')
  }),

  "console": BT.App.create({
    frameworks: 'blossom xm'.w(),
    sourceTree: path.join(__dirname, 'apps/console')
  }),

  "blossom": require('blossom'),
  "foundation": require('blossom/foundation'),
  "datastore": require('blossom/datastore'),

  "xm": require('./frameworks/xm/node/buildfile'),
  "xt": require('./frameworks/xt/node/buildfile'),

  "datasource": BT.Proxy.create({
    proxyHost: 'localhost',
    proxyPort: 9000,
    proxyPrefix: '/'
  }),

  "data": BT.Proxy.create({
    proxyHost: 'localhost',
    proxyPort: 9000,
    proxyPrefix: '/data'
  })
});

// project.accept(BT.LoggingVisitor.create());

BT.Server.create({
  project: project
});

// var project = BT.Project.create({
//   "postbooks": BT.App.create({
//     frameworks: 'foundation datastore xt'.w(),
//     sourceTree: path.join(__dirname, 'apps/postbooks')
//   }),
//   "foundation": require('blossom/foundation'),
//   "datastore": require('blossom/datastore'),
//   "xt": require('./frameworks/xt/node/buildfile')
// });
// 
// // project.accept(BT.LoggingVisitor.create());
// 
// BT.Server.create({
//   project: project
// });
// 
// require('jsdom').defaultDocumentFeatures = {
//   FetchExternalResources   : ['script', 'img'],
//   ProcessExternalResources : false, // We load our code manually.
//   MutationEvents           : false,
//   QuerySelector            : false
// };
// 
// var app = project.findApp('postbooks'),
//     jsFiles = [];
// 
// function appendFile(file) {
//   jsFiles.push(file.get('sourcePath'));
//   // jsFiles.push("http://localhost:4020/" + file.get('targetPath'));
// }
// 
// // First include our frameworks.
// app.get('orderedFrameworks').forEach(function(framework) {
//   framework.get('orderedJavaScriptFiles').forEach(appendFile);
// });
// 
// // Then include the app itself.
// app.get('orderedJavaScriptFiles').forEach(appendFile);
// 
// console.log(jsFiles);
// 
// var jsdom = require('jsdom').jsdom,
//     document = jsdom(app.get('indexHTML')),
//     window = document.createWindow();
// 
//     // set up so we don't need to change window everywhere by defining a reference to global
// global.window = window;
// global.document = document;
// global.top = window;
// 
// global.navigator = { userAgent: "node-js", language: "en" };
// 
// global.sc_require = function do_nothing(){};
// global.sc_resource = function sc_resource(){};
// 
// global.YES = true ;
// global.NO = false ;
// 
// global.SC = {};
// global.SproutCore = SC;
// global.SC.isNode = true;
// 
// // use a node.js xmlhttprequest plugin
// global.XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
// 
// // hack to get the node xmlhttprequest to work
// // msie cannot be true otherwise ready.js wont work properly and
// // node processes that use sproutnode won't exit
// SC.browser = { msie: false, opera: true };
// 
// global.BLOSSOM = true;
// global.SPROUTCORE = false;
// global.FAST_LAYOUT_FUNCTION = false;
// global.sc_assert = function(assertion, msg) {
//   if (!assertion) throw msg || "sc_assert()";
// };
// 
// jsFiles.forEach(function(path) { require(path); });
// 
// console.log(window.document.innerHTML);
// console.log(window.XT.NAMESPACE);
