/*globals global require __dirname BT XM process */

require('blossom/buildtools'); // adds the BT namespace as a global

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

var useCachedSC = false;

// HACK: Use the app object to grab the framework files for now.
app.get('orderedFrameworks').forEach(function(framework) {
  // This is subtle. If the app is loading the exact same blossom/framework
  // that was loaded by the buildtools, we don't want those files (they are 
  // already loaded).
  if (framework.get('sourceTree') === BT.foundationSourcePath) {
    useCachedSC = true;
    return;
  }
  framework.get('orderedJavaScriptFiles').forEach(appendFile);
});

// Don't include the app itself.

global.SC = useCachedSC? global.SproutCore : {};
global.SproutCore = SC;
global.BLOSSOM = true;
global.SPROUTCORE = false;
global.FAST_LAYOUT_FUNCTION = false;

// Load the code we want to test.
// console.log(jsFiles);
jsFiles.forEach(function(path) { require(path); });

// Simulate becoming "ready"
SC.didBecomeReady();

// Start the proxy server.
var http = require('http'),
    PROXY_LISTEN = 4020,
    PROXY_HOST = '127.0.0.1', PROXY_PORT = 9000,
    PROXY_PREFIX_FROM = '/datasource/', PROXY_PREFIX_TO = '/';

var server = http.createServer(function(request, response) {
  var body = '';
  
  request.addListener('data', function(chunk) {
    body += chunk;
  });

  request.addListener('end', function() {
    var proxyClient, proxyRequest,
        url = request.url;

    if (PROXY_PREFIX_FROM.length > 0 && url.indexOf(PROXY_PREFIX_FROM) < 0) {
      console.error("Don't know how to proxy: " + url);
      response.writeHead(404);
      response.end();
      return; // don't proxy this
    } else {
      url = url.replace(PROXY_PREFIX_FROM, PROXY_PREFIX_TO);
    }

    // console.log("PROXYING http://localhost:"+PROXY_LISTEN + request.url + " TO http://" + PROXY_HOST + ":" + PROXY_PORT + url);
    proxyClient = http.createClient(PROXY_PORT, PROXY_HOST);

    proxyClient.addListener('error', function(err) {
      console.error('ERROR: "' + err.message + '" for proxy request on ' + PROXY_HOST + ':' + PROXY_PORT);
      response.writeHead(404);
      response.end();
    });

    request.headers.host = PROXY_HOST;
    request.headers['content-length'] = body.length;
    request.headers['X-Forwarded-Host'] = request.headers.host + ':' + PROXY_LISTEN;
    if (PROXY_PORT != 80) request.headers.host += ':' + PROXY_PORT;
    
    proxyRequest = proxyClient.request(request.method, url, request.headers);

    if (body.length > 0) { proxyRequest.write(body); }

    proxyRequest.addListener('response', function(proxyResponse) {
      response.writeHead(proxyResponse.statusCode, proxyResponse.headers);
      proxyResponse.addListener('data', function(chunk) {
        response.write(chunk, 'binary');
      });
      proxyResponse.addListener('end', function() {
        response.end();
      });
    });

    proxyRequest.end();
  });

}).listen(PROXY_LISTEN);
console.log("PROXY: http://"+PROXY_HOST+":"+PROXY_LISTEN + PROXY_PREFIX_FROM + '*' + " \u2192 http://" + PROXY_HOST + ":" + PROXY_PORT + PROXY_PREFIX_TO + '*');

// Load and process our tests.
var tests = process.argv.slice(2),
    suites = tests.length;

if (suites === 0) {
  console.log("ERROR: Nothing to test. Please pass files to test, like this:\n\n    node testrunner.js tests/path/to/test1.js tests/path/to/test2.js\n");
  server.close(); // nothing to test
}

// console.log(tests);
process.nextTick(function() {
  tests.forEach(function(filename) {
    if (filename) {
      try {
        require('./'+filename).run(null, function(results) {
          suites--;
          if (suites === 0) server.close(); // the process will exit now
        });
      } catch (e) { suites--; console.log(e); }
    }
  });
});
