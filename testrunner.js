/*globals global require __dirname BT XM process */

require('blossom/buildtools'); // adds the SC and BT namespaces as globals

var path = require('path'),
    util  = require('util');

var project = BT.Project.create({
  "postbooks": BT.App.create({
    frameworks: 'foundation datastore xm'.w(),
    sourceTree: path.join(__dirname, 'apps/postbooks')
  }),
  "foundation": require('blossom/foundation'),
  "datastore": require('blossom/datastore'),
  "xm": require('./frameworks/xm/node/buildfile')
});

// project.accept(BT.LoggingVisitor.create());

require('jsdom').defaultDocumentFeatures = {
  FetchExternalResources   : ['script', 'img'],
  ProcessExternalResources : false, // We load our code manually.
  MutationEvents           : false,
  QuerySelector            : false
};

var app = project.findApp('postbooks'),
    jsFiles = [];

function appendFile(file) {
  jsFiles.push(file.get('sourcePath'));
}

// HACK: Use the app object to grab the framework files for now.
app.get('orderedFrameworks').forEach(function(framework) {
  framework.get('orderedJavaScriptFiles').forEach(appendFile);
});

// Don't include the app itself.

var jsdom = require('jsdom').jsdom,
    document = jsdom(app.get('indexHTML')),
    window = document.createWindow();

    // set up so we don't need to change window everywhere by defining a reference to global
global.window = window;
global.document = document;
global.top = window;
global.navigator = { userAgent: "node-js", language: "en" };
global.sc_require = function do_nothing(){};
global.sc_resource = function sc_resource(){};
global.YES = true ;
global.NO = false ;
global.SC = {};
global.SproutCore = SC;
global.SC.isNode = true;
global.XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
global.BLOSSOM = true;
global.SPROUTCORE = false;
global.FAST_LAYOUT_FUNCTION = false;
global.sc_assert = function(assertion, msg) {
  if (!assertion) throw msg || "sc_assert()";
};

// Load the code we want to test.
// console.log(jsFiles);
jsFiles.forEach(function(path) { require(path); });

// Load and process our tests.
var tests = process.argv.slice(2);
console.log(tests);
process.nextTick(function() {
  tests.forEach(function(filename) {
    if (filename) {
      var suite = require('./'+filename);
      try { suite.run();
      } catch (e) { console.log(e); }
    }
  });
  var filename = process.argv[2];
});
