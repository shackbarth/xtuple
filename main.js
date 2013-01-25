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
    passport = require('passport'),
    oauth2 = require('./oauth2/oauth2'),
    routes = require('./routes/routes'),
    user = require('./oauth2/user');

/**
 * Express configuration.
 */
var app = express(),
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

  // gzip all files served.
  app.use(express.compress());
  // Add a basic view engine that will render files from "views" directory.
  app.set('view engine', 'ejs');
  // TODO - This outputs access logs like apache2.
  //app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.session({ store: sessionStore, secret: '.T#T@r5EkPM*N@C%9K-iPW!+T' }));
  app.use(passport.initialize());
  app.use(passport.session());
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
//app.post('/export', routes.expor); TODO: implement, or delete the route

app.get('/dialog/authorize', oauth2.authorization);
app.post('/dialog/authorize/decision', oauth2.decision);
app.post('/oauth/token', oauth2.token);

app.get('/api/userinfo', user.info);

app.get('/', routes.loginForm);
app.post('/login', routes.login);
app.get('/login/scope', routes.scopeForm);
app.post('/login/scopeSubmit', routes.scope);
app.get('/logout', routes.logout);

app.all('/email', routes.email);
app.all('/extensions', routes.extensions);
app.get('/file', routes.file);
app.get('/maintenance', routes.maintenance);
app.get('/report', routes.report);
app.get('/resetPassword', routes.resetPassword);


/**
 * Start the express server. This is the NEW way.
 */
// TODO - Active browser sessions can make calls to this server when it hasn't fully started.
// Need a way to get everything loaded BEFORE we start listening.  Might just move this to the end...
io = require('socket.io').listen(app.listen(2000), {log: false});

// TODO: start up a server on 80 and throw everything to the redirect route
//app.get('/redirect', routes.redirect);

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
      X.debug("socket.io auth no cookie");
      return callback(null, false);
    }
    handshakeData.sessionId = parseSignedCookie(handshakeData.cookie['connect.sid'], '.T#T@r5EkPM*N@C%9K-iPW!+T');

    sessionStore.get(handshakeData.sessionId, function (err, session) {
      // All requests get a session. Make sure the session is authenticated.
      if (!session[passport._key].user
        || !session[passport._key].username
        || !session[passport._key].organization) {
        X.debug("socket.io not authed: ", err);
        err = "socket.io not authed";
        // TODO - This error message isn't making it back to the client.
        return callback({data: session.passport, code: 1}, false);
      }

      var userHash = session[passport._key],
        user = userHash.user,
        username = userHash.username,
        organization = userHash.organization;

      X.debug("socket.io connection attempt: ", session);

      passport.deserializeUser(user, function (err, user) {
        if (err || !user) {
          X.debug("socket.io auth user not found");
          return callback(err);
        }

        // Save user and session data here so it can be used by the endpoints at socket.handshake.
        handshakeData.user = user;
        handshakeData.username = username;
        handshakeData.organization = organization;
        handshakeData.sessionStore = sessionStore;
        X.debug("socket.io auth success");
        callback(null, true);
      });
    });
  } else {
    X.debug("socket.io auth no cookie");
    callback(null, false);
  }
}).on('connection', function (socket) {
  "use strict";
  var shake = socket.handshake,
      session = {passport: {username: shake.username, organization: shake.organization, user: shake.user.id}},
      ensuerLoggedIn = function (callback) {
        // TODO - update session lastAccess: session.touch().save();
        // TODO - Check if session is still valid.
        // It's all done here in express 2.x http://www.danielbaulig.de/socket-ioexpress/

        shake.sessionStore.get(shake.sessionId, function (err, session) {
          // All requests get a session. Make sure the session is authenticated.
          if (err || !session.passport || !session[passport._key]
            || !session[passport._key].user
            || !session[passport._key].username
            || !session[passport._key].organization) {
            X.debug("socket.io request not authed: ", shake.headers.cookie);
            socket.disconnect();
          } else {
            // User is still valid, move along.
            X.debug("socket.io request is authed: ", socket.handshake.headers.cookie);
            callback();
          }
        });
      };

  // To run this from the client:
  // ???
  socket.on('session', function (data, callback) {
    ensuerLoggedIn(function () {
      X.debug("socket.io session request.");
      callback({data: session.passport, code: 1});
    });
  });

  // To run this from the client:
  // XT.dataSource.retrieveRecord("XM.State", 2, {"id":2,"cascade":true,"databaseType":"instance"});
  socket.on('function/retrieveRecord', function (data, callback) {
    ensuerLoggedIn(function () {
      X.debug("socket.io retrieveRecord request.");
      routes.retrieveEngine(data.payload, session, callback);
    });
  });

  // To run this from client:
  // XT.dataSource.fetch({"query":{"orderBy":[{"attribute":"code"}],"recordType":"XM.Honorific"},"force":true,"parse":true,"databaseType":"instance"});
  socket.on('function/fetch', function (data, callback) {
    ensuerLoggedIn(function () {
      X.debug("socket.io fetch request.");
      routes.fetchEngine(data.payload, session, callback);
    });
  });

  // To run this from client:
  // XT.dataSource.dispatch("XT.Session", "settings", null, {success: function () {console.log(arguments);}, error: function () {console.log(arguments);}});
  socket.on('function/dispatch', function (data, callback) {
    ensuerLoggedIn(function () {
      X.debug("socket.io dispatch request.");
      routes.dispatchEngine(data.payload, session, callback);
    });
  });

  // To run this from the client:
  // ???
  // TODO: The first argument to XT.dataSource.commit() is a model and therefore a bit tough to mock
  // XXX untested
  socket.on('function/commitRecord', function (data, callback) {
    ensuerLoggedIn(function () {
      X.debug("socket.io commitRecord request.");
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
    // TODO - Add an option flag that turns on use of Express's MemoryStore as a memory cache.
    // TODO - If we ever run multiple processes/servers, MemoryStore must be replaced with something
    // all processes/servers can use/share and keep in sync like Redis.
// TODO - Call XTPGStore loadCache function.
// See sessionObjectLoaded() above were this is for now.
//sessionStore.loadCache();

// TODO - Check pid file to see if this is already running.
// Kill process or create new pid file.
