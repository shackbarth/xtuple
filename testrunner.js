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
global.YES = true;
global.NO = false;

// Load the code we want to test.
// console.log(jsFiles);
jsFiles.forEach(function(path) { require(path); });

// Simulate becoming "ready"
// but only after a session is acquired
process.once('sessionReady', function() {
  SC.didBecomeReady();
});

// Start the proxy server.
var http = require('http'),
    PROXY_LISTEN = 4020,
    PROXY_HOST = '127.0.0.1', PROXY_PORT = 9000,
    PROXY_PREFIX_FROM = '/datasource/', PROXY_PREFIX_TO = '/';


var SESSION = {
  userName: 'admin',
  password: 'admin',
  sid: null
};

(function() { 
  var req = http.request({
    host: PROXY_HOST,
    port: PROXY_PORT,
    method: 'POST',
    path: '/data'
  }, function(res) {
    var info = '';
    res.on('data', function(chunk) {
      info += chunk;
    }).on('end', function() {
      info = JSON.parse(info);
      SESSION.sid = info.sid;
      delete SESSION.password;
      XM.DataSource.set('session', SESSION);
      process.emit('sessionReady');
    });
  });
  req.on('error', function(e) {
    console.log("Could not acquire session: " + e.message);
    process.exit();
  });
  req.write(JSON.stringify({
    requestType: 'requestSession',
    userName: SESSION.userName,
    password: SESSION.password
  }));
  req.end();
})();

var server = http.createServer(function(request, response) {
  var body = '';
  
  // request.addListener('data', function(chunk) {
  request.on('data', function(chunk) {
    body += chunk;
  }).on('end', function() {
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

    proxyClient = http.request({
      port: PROXY_PORT, 
      host: PROXY_HOST,
      path: url,
      method: 'POST'
    }, function(proxyResponse) {
      response.writeHead(proxyResponse.statusCode, proxyResponse.headers);
      proxyResponse.on('data', function(chunk) {
        response.write(chunk, 'binary');
      }).on('end', function() {
        response.end();
      });
    });

    proxyClient.on('error', function(err) {
      console.error('ERROR: "' + err.message + '" for proxy request on ' + PROXY_HOST + ':' + PROXY_PORT);
      response.writeHead(404);
      response.end();
    });

    request.headers.host = PROXY_HOST;
    request.headers['content-length'] = body.length;
    request.headers['X-Forwarded-Host'] = request.headers.host + ':' + PROXY_LISTEN;
    if (PROXY_PORT != 80) request.headers.host += ':' + PROXY_PORT;
    
    if (body.length > 0) { proxyClient.write(body, 'binary'); }

    proxyClient.end();
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
process.once('sessionReady', function() {
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
