#!/usr/bin/env node

/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, Backbone:true, _:true, XM:true, XT:true, SYS:true, jsonpatch:true*/
process.chdir(__dirname);

Backbone = require("backbone");
_ = require("underscore");
jsonpatch = require("json-patch");
SYS = {};
XT = { };
var express = require('express');
var app;

(function () {
  "use strict";

  var options = require("./lib/options"),
    authorizeNet,
    schemaSessionOptions = {},
    privSessionOptions = {};

  /**
   * Include the X framework.
   */
  require("./xt");

  // Loop through files and load the dependencies.
  // Apes the enyo package process
  // TODO: it would be nice to use a more standardized way
  // of loading our libraries (tools and backbone-x) here
  // in node.
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
  X.relativeDependsPath = X.path.join(X.basePath, "../lib/tools/source");
  require("../lib/tools");
  X.relativeDependsPath = X.path.join(X.basePath, "../lib/backbone-x/source");
  require("../lib/backbone-x");
  Backbone.XM = XM;

  // Argh!!! Hack because `XT` has it's own string format function that
  // is incompatible with `X`....
  String.prototype.f = function () {
    return X.String.format.apply(this, arguments);
  };

  // Another hack: quiet the logs here.
  XT.log = function () {};

  // Set the options.
  X.setup(options);

  // load some more required files
  var datasource = require("./lib/ext/datasource");
  require("./lib/ext/models");
  require("./lib/ext/smtp_transport");

  datasource.setupPgListeners(X.options.datasource.databases, {
    email: X.smtpTransport.sendMail
  });

  // load the encryption key, or create it if it doesn't exist
  // it should created just once, the very first time the datasoruce starts
  var encryptionKeyFilename = X.options.datasource.encryptionKeyFile || './lib/private/encryption_key.txt';
  X.fs.exists(encryptionKeyFilename, function (exists) {
    if (exists) {
      X.options.encryptionKey = X.fs.readFileSync(encryptionKeyFilename, "utf8");
    } else {
      X.options.encryptionKey = Math.random().toString(36).slice(2);
      X.fs.writeFile(encryptionKeyFilename, X.options.encryptionKey);
    }
  });


  XT.session = Object.create(XT.Session);
  XT.session.schemas.SYS = false;

  var getExtensionDir = function (extension) {
    var dirMap = {
      "/private-extensions": X.path.join(__dirname, "../..", extension.location, "source", extension.name),
      "/xtuple-extensions": X.path.join(__dirname, "../..", extension.location, "source", extension.name),
      "/core-extensions": X.path.join(__dirname, "../enyo-client/extensions/source", extension.name),
      "npm": X.path.join(__dirname, "../node_modules", extension.name)
    };
    return dirMap[extension.location];
  };
  var useClientDir = X.useClientDir = function (path, dir) {
    path = path.indexOf("npm") === 0 ? "/" + path : path;
    _.each(X.options.datasource.databases, function (orgValue, orgKey, orgList) {
      app.use("/" + orgValue + path, express.static(dir, { maxAge: 86400000 }));
    });
  };
  var loadExtensionClientside = function (extension) {
    var extensionLocation = extension.location === "npm" ? extension.location : extension.location + "/source";
    useClientDir(extensionLocation + "/" + extension.name + "/client", X.path.join(getExtensionDir(extension), "client"));
  };
  var loadExtensionServerside = function (extension) {
    var packagePath = X.path.join(getExtensionDir(extension), "package.json");
    var packageJson = X.fs.existsSync(packagePath) ? require(packagePath) : undefined;
    var manifestPath = X.path.join(getExtensionDir(extension), "database/source/manifest.js");
    var manifest = X.fs.existsSync(manifestPath) ? JSON.parse(X.fs.readFileSync(manifestPath)) : {};
    var version = packageJson ? packageJson.version : manifest.version;
    X.versions[extension.name] = version || "none"; // XXX the "none" is temporary until we have core extensions in npm

    // TODO: be able to define routes in package.json
    _.each(manifest.routes || [], function (routeDetails) {
      var verb = (routeDetails.verb || "all").toLowerCase(),
        func = require(X.path.join(getExtensionDir(extension),
          "node-datasource", routeDetails.filename))[routeDetails.functionName];

      if (_.contains(["all", "get", "post", "patch", "delete"], verb)) {
        app[verb]('/:org/' + routeDetails.path, func);
      } else {
        console.log("Invalid verb for extension-defined route " + routeDetails.path);
      }
    });
  };

  schemaSessionOptions.username = X.options.databaseServer.user;
  schemaSessionOptions.database = X.options.datasource.databases[0];
  // XXX note that I'm not addressing an underlying bug that we don't wait to
  // listen on the port until all the setup is done
  schemaSessionOptions.success = function () {
    if (!SYS) {
      return;
    }
    var extensions = new SYS.ExtensionCollection();
    extensions.fetch({
      database: X.options.datasource.databases[0],
      success: function (coll, results, options) {
        if (!app) {
          // XXX time bomb: assuming app has been initialized, below, by now
          XT.log("Could not load extension routes or client-side code because the app has not started");
          process.exit(1);
          return;
        }
        useClientDir("/client", "../enyo-client/application");
        _.each(results, loadExtensionServerside);
        _.each(results, loadExtensionClientside);
      }
    });
  };
  XT.session.loadSessionObjects(XT.session.SCHEMA, schemaSessionOptions);

  privSessionOptions.username = X.options.databaseServer.user;
  privSessionOptions.database = X.options.datasource.databases[0];
  XT.session.loadSessionObjects(XT.session.PRIVILEGES, privSessionOptions);

}());


/**
  Grab the version number from the package.json file.
 */

var packageJson = X.fs.readFileSync("../package.json");
X.versions = {
  core: JSON.parse(packageJson).version
};

/**
 * Module dependencies.
 */
var passport = require('passport'),
  oauth2 = require('./oauth2/oauth2'),
  routes = require('./routes/routes'),
  socketio = require('socket.io'),
  url = require('url'),
  utils = require('./oauth2/utils'),
  user = require('./oauth2/user'),
  destroySession;

// TODO - for testing. remove...
//http://stackoverflow.com/questions/13091037/node-js-heap-snapshots-and-google-chrome-snapshot-viewer
//var heapdump = require("heapdump");
// Use it!: https://github.com/c4milo/node-webkit-agent
//var agent = require('webkit-devtools-agent');

/**
 * ###################################################
 * Overrides section.
 *
 * Sometimes we need to change how an npm packages works.
 * Don't edit the packages directly, override them here.
 * ###################################################
 */

/**
  Define our own authentication criteria for passport. Passport itself defines
  its authentication function here:
  https://github.com/jaredhanson/passport/blob/master/lib/passport/http/request.js#L74
  We are stomping on that method with our own special business logic.
  The ensureLoggedIn function will not need to be changed, because that calls this.
 */
require('http').IncomingMessage.prototype.isAuthenticated = function () {
  "use strict";

  var creds = this.session.passport.user;

  if (creds && creds.id && creds.username && creds.organization) {
    return true;
  } else {
    destroySession(this.sessionID, this.session);
    return false;
  }
};

// Stomping on express/connect's Cookie.prototype to only update the expires property
// once a minute. Otherwise it's hit on every session check. This cuts down on chatter.
// See more details here: https://github.com/senchalabs/connect/issues/670
require('express/node_modules/connect/lib/middleware/session/cookie').prototype.__defineSetter__("expires", require('./stomps/expires').expires);

// Stomp on Express's cookie serialize() to not send an "expires" value to the browser.
// This makes the browser cooke a "session" cookie that will never expire and only
// gets removed when the user closes the browser. We still set express.session.cookie.maxAge
// below so our persisted session gets an expires value, but not the browser cookie.
// See this issue for more details: https://github.com/senchalabs/connect/issues/328
require('express/node_modules/cookie').serialize = require('./stomps/cookie').serialize;

// Stomp on Connect's session.
// https://github.com/senchalabs/connect/issues/641
function stompSessionLoad() {
  "use strict";
  return require('./stomps/session');
}
require('express/node_modules/connect').middleware.__defineGetter__('session', stompSessionLoad);
require('express/node_modules/connect').__defineGetter__('session', stompSessionLoad);
require('express').__defineGetter__('session', stompSessionLoad);

/**
 * ###################################################
 * END Overrides section.
 * ###################################################
 */

//
// Load the ssl data
//
var sslOptions = {};

sslOptions.key = X.fs.readFileSync(X.options.datasource.keyFile);
if (X.options.datasource.caFile) {
  sslOptions.ca = _.map(X.options.datasource.caFile, function (obj) {
    "use strict";

    return X.fs.readFileSync(obj);
  });
}
sslOptions.cert = X.fs.readFileSync(X.options.datasource.certFile);

/**
 * Express configuration.
 */
app = express();

var server = X.https.createServer(sslOptions, app),
  parseSignedCookie = require('express/node_modules/connect').utils.parseSignedCookie,
  //MemoryStore = express.session.MemoryStore,
  XTPGStore = require('./oauth2/db/connect-xt-pg')(express),
  io,
  //sessionStore = new MemoryStore(),
  sessionStore = new XTPGStore({ hybridCache: X.options.datasource.requireCache || false }),
  Session = require('express/node_modules/connect/lib/middleware/session').Session,
  Cookie = require('express/node_modules/connect/lib/middleware/session/cookie'),
  cookie = require('express/node_modules/cookie'),
  privateSalt = X.fs.readFileSync(X.options.datasource.saltFile).toString() || 'somesecret';

// Conditionally load express.session(). REST API endpoints using OAuth tokens do not get sessions.
var conditionalExpressSession = function (req, res, next) {
  "use strict";

  var key;

  // REST API endpoints start with "/api" in their path.
  // The 'assets' folder and login page are sessionless.
  if ((/^api/i).test(req.path.split("/")[2]) ||
      (/^\/assets/i).test(req.path) ||
      req.path === "/" ||
      req.path === "/favicon.ico" ||
      req.path === "/forgot-password" ||
      req.path === '/node_modules/jquery/jquery.js' ||
      req.path === "/recover") {

    next();
  } else {
    if (req.path === "/login") {
      // TODO - Add check against X.options database array
      key = req.body.database + ".sid";
    } else if (req.path.split("/")[1]) {
      key = req.path.split("/")[1] + ".sid";
    } else {
      // TODO - Dynamically name the cookie after the database.
      console.log("### FIX ME ### setting cookie name to 'connect.sid' for path = ", JSON.stringify(req.path));
      console.log("### FIX ME ### cookie name should match database name!!!");
      console.trace("### At this location ###");
      key = 'connect.sid';
    }

    // Instead of doing app.use(express.session()) we call the package directly
    // which returns a function (req, res, next) we can call to do the same thing.
    var init_session = express.session({
        key: key,
        store: sessionStore,
        secret: privateSalt,
        // See cookie stomp above for more details on how this session cookie works.
        cookie: {
          path: '/',
          httpOnly: true,
          secure: true,
          maxAge: (X.options.datasource.sessionTimeout * 60 * 1000) || 3600000
        },
        sessionIDgen: function () {
          // TODO: Stomp on connect's sessionID generate.
          // https://github.com/senchalabs/connect/issues/641
          return key.split(".")[0] + "." + utils.generateUUID();
        }
      });

    init_session(req, res, next);
  }
};

// Conditionally load passport.session(). REST API endpoints using OAuth tokens do not get sessions.
var conditionalPassportSession = function (req, res, next) {
  "use strict";

  // REST API endpoints start with "/api" in their path.
  // The 'assets' folder and login page are sessionless.
  if ((/^api/i).test(req.path.split("/")[2]) ||
    (/^\/assets/i).test(req.path) ||
    req.path === "/" ||
    req.path === "/favicon.ico"
    ) {

    next();
  } else {
    // Instead of doing app.use(passport.session())
    var init_passportSessions = passport.session();

    init_passportSessions(req, res, next);
  }
};

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

  // Conditionally load session packages. Based off these examples:
  // http://stackoverflow.com/questions/9348505/avoiding-image-logging-in-express-js/9351428#9351428
  // http://stackoverflow.com/questions/13516898/disable-csrf-validation-for-some-requests-on-express
  app.use(conditionalExpressSession);
  app.use(passport.initialize());
  app.use(conditionalPassportSession);

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
var that = this;

app.use(express.favicon(__dirname + '/views/login/assets/favicon.ico'));
app.use('/assets', express.static('views/login/assets', { maxAge: 86400000 }));
app.use('/node_modules/jquery', express.static('../node_modules/jquery/dist', { maxAge: 86400000 }));

app.get('/:org/dialog/authorize', oauth2.authorization);
app.post('/:org/dialog/authorize/decision', oauth2.decision);
app.post('/:org/oauth/token', oauth2.token);

app.get('/:org/discovery/v1alpha1/apis/v1alpha1/rest', routes.restDiscoveryGetRest);
app.get('/:org/discovery/v1alpha1/apis/:model/v1alpha1/rest', routes.restDiscoveryGetRest);
app.get('/:org/discovery/v1alpha1/apis', routes.restDiscoveryList);

app.get('/:org/api/userinfo', user.info);

app.post('/:org/api/v1alpha1/services/:service/:id', routes.restRouter);
app.all('/:org/api/v1alpha1/resources/:model/:id', routes.restRouter);
app.all('/:org/api/v1alpha1/resources/:model', routes.restRouter);
app.all('/:org/api/v1alpha1/resources/*', routes.restRouter);

app.get('/', routes.loginForm);
app.post('/login', routes.login);
app.get('/forgot-password', routes.forgotPassword);
app.post('/recover', routes.recoverPassword);
app.get('/:org/recover/reset/:id/:token', routes.verifyRecoverPassword);
app.post('/:org/recover/resetUpdate', routes.resetRecoveredPassword);
app.get('/login/scope', routes.scopeForm);
app.post('/login/scopeSubmit', routes.scope);
app.get('/logout', routes.logout);
app.get('/:org/logout', routes.logout);
app.get('/:org/app', routes.app);
app.get('/:org/debug', routes.debug);

app.all('/:org/credit-card', routes.creditCard);
app.all('/:org/change-password', routes.changePassword);
app.all('/:org/client/build/client-code', routes.clientCode);
app.all('/:org/email', routes.email);
app.all('/:org/export', routes.exxport);
app.get('/:org/file', routes.file);
app.get('/:org/generate-report', routes.generateReport);
app.all('/:org/install-extension', routes.installExtension);
app.get('/:org/locale', routes.locale);
app.all('/:org/oauth/generate-key', routes.generateOauthKey);
app.get('/:org/reset-password', routes.resetPassword);
app.post('/:org/oauth/revoke-token', routes.revokeOauthToken);
app.all('/:org/vcfExport', routes.vcfExport);


// Set up the other servers we run on different ports.

var redirectServer = express();
redirectServer.get(/.*/, routes.redirect); // RegEx for "everything"
redirectServer.listen(X.options.datasource.redirectPort, X.options.datasource.bindAddress);

/**
 * Start the express server. This is the NEW way.
 */
// TODO - Active browser sessions can make calls to this server when it hasn't fully started.
// That can cause it to crash at startup.
// Need a way to get everything loaded BEFORE we start listening.  Might just move this to the end...
io = socketio.listen(server.listen(X.options.datasource.port, X.options.datasource.bindAddress));

X.log("Server listening at: ", X.options.datasource.bindAddress);
X.log("node-datasource started on port: ", X.options.datasource.port);
X.log("redirectServer started on port: ", X.options.datasource.redirectPort);
X.log("Databases accessible from this server: \n", JSON.stringify(X.options.datasource.databases, null, 2));


/**
 * Destroy a single session.
 * @param {Object} val - Session object.
 * @param {String} key - Session id.
 */
destroySession = function (key, val) {
  "use strict";

  var sessionID;

  // Timeout socket.
  if (val && val.socket && val.socket.id) {
    _.each(io.sockets.sockets, function (sockVal, sockKey, sockList) {
      if (val.socket.id === sockKey) {
        _.each(sockVal.manager.namespaces, function (spaceVal, spaceKey, spaceList) {
          sockVal.flags.endpoint = spaceVal.name;
          // Tell the client it timed out. This will redirect the client to /logout
          // which will destroy the session, but we can't rely on the client for that.
          sockVal.emit("timeout");
        });

        // Disconnect socket.
        sockVal.disconnect();
      }
    });
  }

  sessionID = key.replace(sessionStore.prefix, '');

  // Destroy session here incase the client never hits /logout.
  sessionStore.destroy(sessionID, function (err) {
    //X.debug("Session destroied: ", key, " error: ", err);
  });
};

// TODO - Use NODE_ENV flag to switch between development and production.
// See "Understanding the configure method" at:
// https://github.com/LearnBoost/Socket.IO/wiki/Configuring-Socket.IO
io.configure(function () {
  "use strict";

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
    ]
  );
});

/**
 * Setup socket.io routes and handlers.
 *
 * Socket.io authorization modeled off of:
 * https://github.com/LearnBoost/socket.io/wiki/Authorizing
 * http://stackoverflow.com/questions/13095418/how-to-use-passport-with-express-and-socket-io
 * https://github.com/jfromaniello/passport.socketio
 */
io.of('/clientsock').authorization(function (handshakeData, callback) {
  "use strict";

  var key;

  if (handshakeData.headers.cookie) {
    handshakeData.cookie = cookie.parse(handshakeData.headers.cookie);

    if (handshakeData.headers.referer && url.parse(handshakeData.headers.referer).path.split("/")[1]) {
      key = url.parse(handshakeData.headers.referer).path.split("/")[1];
    } else if (X.options.datasource.testDatabase) {
      // for some reason zombie doesn't send the referrer in the socketio call
      // https://groups.google.com/forum/#!msg/socket_io/MPpXrP5N9k8/xAyk1l8Iw8YJ
      key = X.options.datasource.testDatabase;
    } else {
      return callback(null, false);
    }


    if (!handshakeData.cookie[key + '.sid']) {
      return callback(null, false);
    }

    // Add sessionID so we can use it to check for valid sessions on each request below.
    handshakeData.sessionID = parseSignedCookie(handshakeData.cookie[key + '.sid'], privateSalt);

    sessionStore.get(handshakeData.sessionID, function (err, session) {
      if (err) {
        return callback(err);
      }

      // All requests get a session. Make sure the session is authenticated.
      if (!session || !session.passport || !session.passport.user ||
        !session.passport.user.id ||
        !session.passport.user.organization ||
        !session.passport.user.username ||
        !session.cookie || !session.cookie.expires) {

        destroySession(handshakeData.sessionID, session);

        // Not an error exactly, but the cookie is invalid. The user probably logged off.
        return callback(null, false);
      }

      // Prep the cookie and create a session object so we can touch() it on each request below.
      session.cookie.expires = new Date(session.cookie.expires);
      session.cookie = new Cookie(session.cookie);
      handshakeData.session = new Session(handshakeData, session);

      // Add sessionStore here so it can be used to lookup valid session on each request below.
      handshakeData.sessionStore = sessionStore;

      // Move along.
      callback(null, true);
    });
  } else {
    callback(null, false);
  }
}).on('connection', function (socket) {
  "use strict";

  var ensureLoggedIn = function (callback, payload) {
        socket.handshake.sessionStore.get(socket.handshake.sessionID, function (err, session) {
          var expires,
              current;

          // All requests get a session. Make sure the session is authenticated.
          if (err || !session || !session.passport || !session.passport.user ||
              !session.passport.user.id ||
              !session.passport.user.organization ||
              !session.passport.user.username ||
              !session.cookie || !session.cookie.expires) {

            return destroySession(socket.handshake.sessionID, session);
          }

          // Make sure the sesion hasn't expired yet.
          expires = new Date(session.cookie.expires);
          current = new Date();
          if (expires <= current) {
            return destroySession(socket.handshake.sessionID, session);
          } else {
            // User is still valid

            // Update session expiration timeout, unless this is an automated call of
            // some sort (e.g. lock refresh)
            if (!payload || !payload.automatedRefresh) {
              socket.handshake.session.touch().save();
            }

            // Move along.
            callback(session);
          }
        });
      };

  // Save socket.id to the session store so we can disconnect that socket server side
  // when a session is timed out. That should notify the client imediately they have timed out.
  socket.handshake.session.socket = {id: socket.id};
  socket.handshake.session.save();

  // To run this from the client:
  // ???
  socket.on('session', function (data, callback) {
    ensureLoggedIn(function (session) {
      var callbackObj = X.options.client || {};
      callbackObj = _.extend(callbackObj,
        {
          data: session.passport.user,
          code: 1,
          debugging: X.options.datasource.debugging,
          emailAvailable: _.isString(X.options.datasource.smtpHost) && X.options.datasource.smtpHost !== "",
          printAvailable: _.isString(X.options.datasource.printer) && X.options.datasource.printer !== "",
          versions: X.versions
        });
      callback(callbackObj);
    }, data && data.payload);
  });

  // To run this from the client:
  socket.on('delete', function (data, callback) {
    ensureLoggedIn(function (session) {
      routes.queryDatabase("delete", data.payload, session, callback);
    }, data && data.payload);
  });

  // To run this from the client:
  // XT.dataSource.request(m = new XM.Contact(), "get", {nameSpace: "XM", type: "Contact", id: "1"}, {propagate: true, parse: true, success: function () {console.log("success", arguments)}, error: function () {console.log("error", arguments);}});
  socket.on('get', function (data, callback) {
    ensureLoggedIn(function (session) {
      routes.queryDatabase("get", data.payload, session, callback);
    }, data && data.payload);
  });

  // To run this from the client:
  socket.on('patch', function (data, callback) {
    ensureLoggedIn(function (session) {
      routes.queryDatabase("patch", data.payload, session, callback);
    }, data && data.payload);
  });

  // To run this from the client:
  socket.on('post', function (data, callback) {
    ensureLoggedIn(function (session) {
      routes.queryDatabase("post", data.payload, session, callback);
    }, data && data.payload);
  });

  // Tell the client it's connected.
  socket.emit("ok");
});

/**
 * Job loading section.
 *
 * The following are jobs that must be started at start up or scheduled to run periodically.
 */

// TODO - Check pid file to see if this is already running.
// Kill process or create new pid file.

// Run the expireSessions cleanup/garbage collection once a minute.
setInterval(function () {
    "use strict";

    //X.debug("session cleanup called at: ", new Date());
    sessionStore.expireSessions(destroySession);
  }, 60000);
