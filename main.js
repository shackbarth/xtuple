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

  X.debugging = true;

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
    sessionStore = new XTPGStore();

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
app.get('/', site.loginForm);
app.post('/login', site.login);
app.get('/logout', site.logout);
app.get('/account', site.account);

app.get('/dialog/authorize', oauth2.authorization);
app.post('/dialog/authorize/decision', oauth2.decision);
app.post('/oauth/token', oauth2.token);

app.get('/api/userinfo', user.info);


/**
 * Start the express server. This is the NEW way.
 */
io = socket.listen(app.listen(2000));

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

  //console.log("######### socket.io connected with socket: ", socket);

  socket.on('session', function (data) {
    console.log("######### session socket.io with data: ", data);
  });

  socket.on('function/retrieveRecord', function (data) {
    console.log("######### function/retrieveRecord socket.io with data: ", data);
  });

  socket.on('function/resetPassword', function (data) {
    console.log("######### function/resetPassword socket.io with data: ", data);
  });

  socket.on('function/logout', function (data) {
    console.log("######### function/logout socket.io with data: ", data);
  });

  socket.on('function/fetch', function (data) {
    console.log("######### function/fetch socket.io with data: ", data);
  });

  socket.on('function/extensions', function (data) {
    console.log("######### function/extensions socket.io with data: ", data);
  });

  socket.on('function/dispatch', function (data) {
    console.log("######### function/dispatch socket.io with data: ", data);
  });

  socket.on('function/commitRecord', function (data) {
    console.log("######### function/commitRecord socket.io with data: ", data);
  });

  socket.on('function/changePassword', function (data) {
    console.log("######### function/changePassword socket.io with data: ", data);
  });

  // Tell the client you're connected.
  socket.emit("ok");
  //socket.emit("error");
  //socket.emit("debug");
  //socket.emit("timeout");
  //socket.emit("disconnect");

});