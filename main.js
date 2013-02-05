#!/usr/bin/env node

/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, Backbone:true, _:true, XM:true, XT:true*/

Backbone = require("backbone");
_ = require("underscore");

(function () {
  "use strict";

  var options = require("./lib/options"),
    schema = false,
    privs = false,
    sessionObjectLoaded,
    schemaOptions = {},
    privsOptions = {};

  /**
   * Include the X framework.
   */
  require("xt");

  // Loop through files and load the dependencies.
  X.relativeDependsPath = "";
  X.depends = function () {
    var dir = X.relativeDependsPath,
      files = X.$A(arguments),
      pathBeforeRecursion;

    _.each(files, function (file) {
      if (X.fs.statSync(X.path.join(dir, file)).isDirectory()) {
        pathBeforeRecursion = X.relativeDependsPath;
        X.relativeDependsPath = X.path.join(dir, file);
        X.depends("package.js");
        X.relativeDependsPath = pathBeforeRecursion;
      } else {
        require(X.path.join(dir, file));
      }
    });
  };

  // Load other xTuple libraries using X.depends above.
  require("backbone-relational");
  X.relativeDependsPath = X.path.join(X.basePath, "node_modules/tools/source");
  require("tools");
  X.relativeDependsPath = X.path.join(X.basePath, "node_modules/backbone-x/source");
  require("backbone-x");
  Backbone.XM = XM;

  // Argh!!! Hack because `XT` has it's own string format function that
  // is incompatible with `X`....
  String.prototype.f = function () {
    return X.String.format.apply(this, arguments);
  };

  // Another hack: quiet the logs here.
  XT.log = function () {};

  // Make absolutely sure we're going to start.
  options.autoStart = true;

  //X.debugging = true;

  // Set the options and start the servers the OLD way.
  X.setup(options);


  // Initiate the internal session.
  sessionObjectLoaded = function () {
    if (schema && privs) {
      // Start polling for expired user sessions and delete the records.
      X.cachePollingInterval = setInterval(X.Session.pollCache, 10000);
      X.addCleanupTask(function () {
        clearInterval(X.cachePollingInterval);
      });
      // TODO - We need a start up script that handles async in the right order.
      // Sticking this here so it gets called after the session schema is loaded.
      sessionStore.loadCache();
    }
  };
  schemaOptions.success = function () {
    schema = true;
    sessionObjectLoaded();
  };
  privsOptions.success = function () {
    privs = true;
    sessionObjectLoaded();
  };
  privsOptions.username = X.options.globalDatabase.nodeUsername;

  XT.session = Object.create(XT.Session);
  XT.session.loadSessionObjects(XT.session.SCHEMA, schemaOptions);
  XT.session.loadSessionObjects(XT.session.PRIVILEGES, privsOptions);

}());


/**
 * Module dependencies.
 */
var express = require('express'),
    flash = require('connect-flash'),
    socketio = require('socket.io'),
    passport = require('passport'),
    oauth2 = require('./oauth2/oauth2'),
    routes = require('./routes/routes'),
    user = require('./oauth2/user');

/**
  Define our own authentication criteria for passport. Passport itself defines
  its authentication function here:
  https://github.com/jaredhanson/passport/blob/master/lib/passport/http/request.js#L74
  and we are stomping on that method with our own special business logic.
  The ensureLoggedIn function will not need to be changed, because that calls this.
 */
require('http').IncomingMessage.prototype.isAuthenticated = function () {
  var creds = this.session.passport.user;
  return creds.id && creds.username && creds.organization;
}


// TODO - This can be removed after socket.io 1.0.0 update hopefully.
// We're stomping on Static to apply this fix:
// https://github.com/LearnBoost/socket.io/issues/932
// https://github.com/LearnBoost/socket.io/issues/984
/**
 * Gzip compress buffers.
 *
 * @param {Buffer} data The buffer that needs gzip compression
 * @param {Function} callback
 * @api public
 */
require('socket.io').Static.prototype.gzip = function (data, callback) {
  var cp = require('child_process')
    , gzip = cp.spawn('gzip', ['-9', '-c', '-f', '-n'])
    , encoding = Buffer.isBuffer(data) ? 'binary' : 'utf8'
    , buffer = []
    , err;

  gzip.stdout.on('data', function (data) {
    buffer.push(data);
  });

  gzip.stderr.on('data', function (data) {
    err = data +'';
    buffer.length = 0;
  });

  // TODO - This was changed to 'exit' from 'close'.
  gzip.on('exit', function () {
    if (err) return callback(err);

    var size = 0
      , index = 0
      , i = buffer.length
      , content;

    while (i--) {
      size += buffer[i].length;
    }

    content = new Buffer(size);
    i = buffer.length;

    buffer.forEach(function (buffer) {
      var length = buffer.length;

      buffer.copy(content, index, 0, length);
      index += length;
    });

    buffer.length = 0;
    callback(null, content);
  });

  gzip.stdin.end(data, encoding);
};

var sslOptions = {
    key: X.fs.readFileSync(X.options.datasource.keyFile),
    cert: X.fs.readFileSync(X.options.datasource.certFile),
};

/**
 * Express configuration.
 */
var app = express(),
  server = X.https.createServer(sslOptions, app),
  connect = require('connect'),
  parseSignedCookie = connect.utils.parseSignedCookie,
  //MemoryStore = express.session.MemoryStore,
  XTPGStore = require('./oauth2/db/connect-xt-pg')(express),
  cookie = require('express/node_modules/cookie'),
  io,
  sessionStore = new XTPGStore({ hybridCache: true });
  //sessionStore = new MemoryStore();

app.configure(function () {
  "use strict";

  // gzip all static files served.
  app.use(express.compress());
  // Add a basic view engine that will render files from "views" directory.
  app.set('view engine', 'ejs');
  // TODO - This outputs access logs like apache2 and some other user things.
  //app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  // TODO - Need to tweak the expiring of sessions.
  // Destroy it from the db and cache.
  // Try to only update it once a minute instead of on EVERY FREAKING REQUEST.
  //app.use(express.session({ store: sessionStore, secret: '.T#T@r5EkPM*N@C%9K-iPW!+T', cookie: { path: '/', httpOnly: true, maxAge: 60000 } }));
  app.use(express.session({ store: sessionStore, secret: '.T#T@r5EkPM*N@C%9K-iPW!+T'}));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());
  app.use(app.router);
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

/**
 * Passport configuration.
 */
require('./oauth2/passport');

/**
 * Setup HTTP routes and handlers.
 */
app.use('/assets', express.static('views/login/assets'));
app.use('/client', express.static('www/client'));
app.use('/public-extensions', express.static('www/public-extensions'));
app.use('/private-extensions', express.static('www/private-extensions'));

app.get('/dialog/authorize', oauth2.authorization);
app.post('/dialog/authorize/decision', oauth2.decision);
app.post('/oauth/token', oauth2.token);

app.get('/api/userinfo', user.info);

app.get('/', routes.loginForm);
app.post('/login', routes.login);
app.get('/login/scope', routes.scopeForm);
app.post('/login/scopeSubmit', routes.scope);
app.get('/logout', routes.logout);

app.all('/changePassword', routes.changePassword);
app.all('/dataFromKey', routes.dataFromKey);
app.all('/email', routes.email);
app.all('/export', routes.exxport);
app.all('/extensions', routes.extensions);
app.get('/file', routes.file);
app.get('/maintenance', routes.maintenance);
app.get('/report', routes.report);
app.get('/resetPassword', routes.resetPassword);
app.get('/syncUser', routes.syncUser);


// Set up the other servers we run on different ports.
var unexposedServer = express();
unexposedServer.get('/maintenance', routes.maintenanceLocalhost);
unexposedServer.listen(442);

var redirectServer = express();
redirectServer.get(/.*/, routes.redirect); // RegEx for "everything"
redirectServer.listen(80);

/**
 * Start the express server. This is the NEW way.
 */
// TODO - Active browser sessions can make calls to this server when it hasn't fully started.
// That can cause it to crash at startup.
// Need a way to get everything loaded BEFORE we start listening.  Might just move this to the end...
io = socketio.listen(server.listen(X.options.datasource.port));

// TODO - Use NODE_ENV flag to switch between development and production.
// See "Understanding the configure method" at:
// https://github.com/LearnBoost/Socket.IO/wiki/Configuring-Socket.IO
io.configure(function (){
  io.set('log', false);
  // TODO - We need to implement a store for this if we run multiple processes:
  // https://github.com/LearnBoost/socket.io/tree/0.9/lib/stores
  //http://stackoverflow.com/questions/9267292/examples-in-using-redisstore-in-socket-io/9275798#9275798
  //io.set('store', someNewStore);                // Use our someNewStore.
  io.set('browser client minification', true);  // Send minified file to the client.
  io.set('browser client etag', true);          // Apply etag caching logic based on version number
  // TODO - grubmle - See prototype stomp above:
  // https://github.com/LearnBoost/socket.io/issues/932
  // https://github.com/LearnBoost/socket.io/issues/984
  io.set('browser client gzip', true);          // gzip the file.
  //io.set('log level', 1);                       // Reduce logging.
  io.set('transports', [                        // Enable all transports.
      'websocket',
      'htmlfile',
      'xhr-polling',
      'jsonp-polling'
  ]);
});

/**
 * Setup socket.io routes and handlers.
 */
io.of('/clientsock').authorization(function (handshakeData, callback) {
  "use strict";
  // Socket.io authorization modeled off of:
  // https://github.com/LearnBoost/socket.io/wiki/Authorizing
  // http://stackoverflow.com/questions/13095418/how-to-use-passport-with-express-and-socket-io
  // https://github.com/jfromaniello/passport.socketio

  if (handshakeData.headers.cookie) {
    // Save parsedSessionId to handshakeData.
    handshakeData.cookie = cookie.parse(handshakeData.headers.cookie);

    if (!handshakeData.cookie['connect.sid']) {
      return callback(null, false);
    }

    // Save the sessionId so we can use it to check for valid sessions later on.
    handshakeData.sessionId = parseSignedCookie(handshakeData.cookie['connect.sid'], '.T#T@r5EkPM*N@C%9K-iPW!+T');

    sessionStore.get(handshakeData.sessionId, function (err, session) {
      // All requests get a session. Make sure the session is authenticated.
      if (err || !session.passport || !session.passport.user
        || !session.passport.user.id
        || !session.passport.user.organization
        || !session.passport.user.username) {

        err = "socket.io not authed";
        // TODO - This error message isn't making it back to the client.
        return callback({data: session.passport.user, code: 1}, false);
      }

      // Add sessionStore here so it can be used to lookup valid session on each request.
      handshakeData.sessionStore = sessionStore;
      callback(null, true);
    });
  } else {
    callback(null, false);
  }
}).on('connection', function (socket) {
  "use strict";
  var ensureLoggedIn = function (callback) {
        // TODO - update session lastAccess: session.touch().save();

        socket.handshake.sessionStore.get(socket.handshake.sessionId, function (err, session) {
          // All requests get a session. Make sure the session is authenticated.
          if (err || !session || !session.passport || !session.passport.user
            || !session.passport.user.id
            || !session.passport.user.organization
            || !session.passport.user.username) {

            // Tell the client it timed out.
            socket.emit("timeout");
            return socket.disconnect();
          } else {
            // User is still valid, move along.
            callback(session);
          }
        });
      };

  // To run this from the client:
  // ???
  socket.on('session', function (data, callback) {
    ensureLoggedIn(function (session) {
      callback({data: session.passport.user, code: 1});
    });
  });

  // To run this from the client:
  // XT.dataSource.retrieveRecord("XM.State", 2, {"id":2,"cascade":true,"databaseType":"instance"});
  socket.on('function/retrieveRecord', function (data, callback) {
    ensureLoggedIn(function (session) {
      routes.retrieveEngine(data.payload, session, callback);
    });
  });

  // To run this from client:
  // XT.dataSource.fetch({"query":{"orderBy":[{"attribute":"code"}],"recordType":"XM.Honorific"},"force":true,"parse":true,"databaseType":"instance"});
  socket.on('function/fetch', function (data, callback) {
    ensureLoggedIn(function (session) {
      routes.fetchEngine(data.payload, session, callback);
    });
  });

  // To run this from client:
  // XT.dataSource.dispatch("XT.Session", "settings", null, {success: function () {console.log(arguments);}, error: function () {console.log(arguments);}});
  socket.on('function/dispatch', function (data, callback) {
    ensureLoggedIn(function (session) {
      routes.dispatchEngine(data.payload, session, callback);
    });
  });

  // To run this from the client:
  // ???
  // TODO: The first argument to XT.dataSource.commit() is a model and therefore a bit tough to mock
  // XXX untested
  socket.on('function/commitRecord', function (data, callback) {
    ensureLoggedIn(function (session) {
      routes.commitEngine(data.payload, session, callback);
    });
  });

  // Tell the client it's connected.
  socket.emit("ok");
});

/**
 * Job loading section.
 *
 * The following are jobs that must be started at start up or scheduled to run periodically.
 */

// Load XTPGStore into MemoryStore at startup for caching.
    // TODO - If we ever run multiple processes/servers, MemoryStore must be replaced with something
    // all processes/servers can use/share and keep in sync like Redis.
// TODO - Call XTPGStore loadCache function.
// See sessionObjectLoaded() above were this is for now.
//sessionStore.loadCache();

// TODO - Check pid file to see if this is already running.
// Kill process or create new pid file.
