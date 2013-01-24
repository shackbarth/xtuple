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
    site = require('./oauth2/site'),
    routes = require('./routes/routes'),
    socket = require('socket.io'),
    user = require('./oauth2/user');

/**
 * Express configuration.
 */
var app = express(),
// TODO - can we get to this through express? connect.utils.parseSignedCookie
    connect           = require('connect'),
    parseSignedCookie = connect.utils.parseSignedCookie,
    //MemoryStore = express.session.MemoryStore,
    XTPGStore = require('./oauth2/db/connect-xt-pg')(express),
    cookie = require('express/node_modules/cookie'),
    io,
    //sessionStore = new MemoryStore();
    sessionStore = new XTPGStore({ hybridCache: true });

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
//app.get('/', site.index);
app.use('/assets', express.static('views/login/assets'));
app.use('/client', express.static('www/client'));
app.use('/public-extensions', express.static('www/public-extensions'));
app.use('/private-extensions', express.static('www/private-extensions'));
app.get('/account', site.account);
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
io = socket.listen(app.listen(2000));

// TODO: start up a server on 80 and throw everything to the redirect route
//app.get('/redirect', routes.redirect);

/**
 * Setup socket.io routes and handlers.
 */
io.of('/clientsock').authorization(function (handshakeData, callback) {
  "use strict";

  console.log("##### socket.io handshakeData: ", handshakeData);

  if (handshakeData.headers.cookie) {
    // save parsedSessionId to handshakeData
    handshakeData.cookie = cookie.parse(handshakeData.headers.cookie);
    handshakeData.sessionId = parseSignedCookie(handshakeData.cookie['connect.sid'], '.T#T@r5EkPM*N@C%9K-iPW!+T');

    console.log("##### send socket.io to deserializeUser: ", handshakeData.sessionId);

    sessionStore.get(handshakeData.sessionId, function (err, session) {
      var user = session[passport._key]['user'];

      passport.deserializeUser(user, function (err, user) {
        if (err || !user) {
          console.log("##### socket.io deserializeUser FAILED: ", err, user);
        }
        console.log("##### socket.io deserializeUser: ", user);
        handshakeData.user = user;
        callback(null, true);
      });
    });
  }
  callback(null, true);


  console.log("##### socket.io handshakeData: ", handshakeData);
  handshakeData.foo = 'baz';
  callback(null, true);
}).on('connection', function (socket) {
  // XXX TODO we need to get this session data from somewhere
  var mockDevSession = {passport: {username: "admin", organization: "dev", user: "admin"}};

  //console.log("######### socket.io connected with socket: ", socket);

  // pretty sure this doesn't have to be a functor
  //socket.on('session', function (data) {
  //  console.log("######### session socket.io with data: ", data);
  //});

  // run this from the client:
  // XT.dataSource.retrieveRecord("XM.State", 2, {"id":2,"cascade":true,"databaseType":"instance"});
  socket.on('function/retrieveRecord', function (data, callback) {
    //console.log("######### function/retrieveRecord socket.io with data: ", data);
    routes.retrieveEngine(data.payload, mockDevSession, callback);
  });

  // run this from client:
  // XT.dataSource.fetch({"query":{"orderBy":[{"attribute":"code"}],"recordType":"XM.Honorific"},"force":true,"parse":true,"databaseType":"instance"});
  socket.on('function/fetch', function (data, callback) {
    //console.log("######### function/fetch socket.io with data: ", data);
    routes.fetchEngine(data.payload, mockDevSession, callback);
  });

  // run this from client:
  // XT.dataSource.dispatch("XT.Session", "settings", null, {success: function () {console.log(arguments);}, error: function () {console.log(arguments);}});
  socket.on('function/dispatch', function (data, callback) {
    //console.log("######### function/dispatch socket.io with data: ", data);
    routes.dispatchEngine(data.payload, mockDevSession, callback);
  });

  // run this from the client:
  // ???
  // TODO: the first argument to XT.dataSource.commit() is a model and therefore a bit tough to mock
  // XXX untested
  socket.on('function/commitRecord', function (data, callback) {
    //console.log("######### function/commitRecord socket.io with data: ", data);
    routes.commitEngine(data.payload, mockDevSession, callback);
  });

  // Tell the client you're connected.
  socket.emit("ok");
  //socket.emit("error");
  //socket.emit("debug");
  //socket.emit("timeout");
  //socket.emit("disconnect");

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
// Kill process or create  new pid file.
