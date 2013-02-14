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
  require("./xt");

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
    passport = require('passport'),
    oauth2 = require('./oauth2/oauth2'),
    routes = require('./routes/routes'),
    socketio = require('socket.io'),
    user = require('./oauth2/user');

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

  if (creds.id && creds.username && creds.organization) {
    return true;
  } else {

    // TODO - Load the session first and get the socket.id so it can be disconnected.
    // TODO - Destroy expired session in the db and cache.

    return false;
  }
};


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
  "use strict";

  var cp = require('child_process'),
      gzip = cp.spawn('gzip', ['-9', '-c', '-f', '-n']),
      encoding = Buffer.isBuffer(data) ? 'binary' : 'utf8',
      buffer = [],
      err;

  gzip.stdout.on('data', function (data) {
    buffer.push(data);
  });

  gzip.stderr.on('data', function (data) {
    err = data + '';
    buffer.length = 0;
  });

  // Override Here - This was changed to 'exit' from 'close'.
  gzip.on('exit', function () {
    if (err) return callback(err);

    var size = 0,
        index = 0,
        i = buffer.length,
        content;

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

// Stomping on express/connect's Cookie.prototype to only update the expires property
// once a minute. Otherwise it's hit on every session check. This cuts down on chatter.
// See more details here: https://github.com/senchalabs/connect/issues/670
require('express/node_modules/connect/lib/middleware/session/cookie').prototype.__defineSetter__("expires", function (date) {
  "use strict";

  if (date === null || this._expires === null) {
    // Initialize "this._expires" when creating a new cookie.
    this._expires = date;
    this.originalMaxAge = this.maxAge;
  } else if (date instanceof Date) {
    // This captures a certain "set" call we are interested in.
    var expiresDate;

    if (typeof this._expires === 'string') {
      expiresDate = new Date(this._expires);
    }

    if (this._expires instanceof Date) {
      expiresDate = this._expires;
    }

    // If the difference between the new time, "date", and the old time, "this._expires",
    // is more than 1 minute, then we update it which updates the db and cache magically.
    // OR if they match, we need to update "this._expires" so it's a instanceof Date.
    //console.log("updates in: ", 60000 - (date - expiresDate));
    if ((date - expiresDate > 60000) || (JSON.stringify(date) === JSON.stringify(expiresDate))) {
      //console.log("expires updated: ", date - expiresDate);
      this._expires = date;
      this.originalMaxAge = this.maxAge;
    }
  }
});

// Stomp on Express's cookie serialize() to not send an "expires" value to the browser.
// This makes the browser cooke a "session" cookie that will never expire and only
// gets removed when the user closes the browser. We still set express.session.cookie.maxAge
// below so our persisted session gets an expires value, but not the browser cookie.
// See this issue for more details: https://github.com/senchalabs/connect/issues/328
require('express/node_modules/cookie').serialize = function (name, val, opt){
    // Need to add encode here for the stomp to work.
    var encode = encodeURIComponent;

    var pairs = [name + '=' + encode(val)];
    opt = opt || {};

    if (opt.maxAge) pairs.push('Max-Age=' + opt.maxAge);
    if (opt.domain) pairs.push('Domain=' + opt.domain);
    if (opt.path) pairs.push('Path=' + opt.path);
    // TODO - Override here, skip this.
    //if (opt.expires) pairs.push('Expires=' + opt.expires.toUTCString());
    if (opt.httpOnly) pairs.push('HttpOnly');
    if (opt.secure) pairs.push('Secure');

    return pairs.join('; ');
};

/**
 * ###################################################
 * END Overrides section.
 * ###################################################
 */

//
// Load the ssl data
//
var sslOptions = {}
sslOptions.key = X.fs.readFileSync(X.options.datasource.keyFile);
if (X.options.datasource.caFile) {
  sslOptions.ca = _.map(X.options.datasource.caFile, function (obj) {
    return X.fs.readFileSync(obj);
  });
}
sslOptions.cert = X.fs.readFileSync(X.options.datasource.certFile);

/**
 * Express configuration.
 */
var app = express(),
  server = X.https.createServer(sslOptions, app),
  connect = require('connect'),
  parseSignedCookie = connect.utils.parseSignedCookie,
  //MemoryStore = express.session.MemoryStore,
  XTPGStore = require('./oauth2/db/connect-xt-pg')(express),
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

  // See cookie stopm above for more details.
  app.use(express.session({ store: sessionStore, secret: '.T#T@r5EkPM*N@C%9K-iPW!+T', cookie: { path: '/', httpOnly: true, secure: true, maxAge: 1800000 } }));

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
app.use('/assets', express.static('views/login/assets', { maxAge: 86400000 }));
app.use('/client', express.static('../enyo-client/application', { maxAge: 86400000 }));
app.use('/public-extensions', express.static('../enyo-client/extensions', { maxAge: 86400000 }));
app.use('/private-extensions', express.static('../../private-extensions', { maxAge: 86400000 }));

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

  var cookie = require('express/node_modules/cookie');

  if (handshakeData.headers.cookie) {
    handshakeData.cookie = cookie.parse(handshakeData.headers.cookie);

    if (!handshakeData.cookie['connect.sid']) {
      return callback(null, false);
    }

    // Add sessionID so we can use it to check for valid sessions on each request below.
    handshakeData.sessionID = parseSignedCookie(handshakeData.cookie['connect.sid'], '.T#T@r5EkPM*N@C%9K-iPW!+T');

    sessionStore.get(handshakeData.sessionID, function (err, session) {
      // All requests get a session. Make sure the session is authenticated.
      if (err || !session || !session.passport || !session.passport.user
        || !session.passport.user.id
        || !session.passport.user.organization
        || !session.passport.user.username
        || !session.cookie || !session.cookie.expires) {

        // TODO - Load the session first and get the socket.id so it can be disconnected.
        // TODO - Destroy expired session in the db and cache.

        err = "socket.io not authed";
        // TODO - This error message isn't making it back to the client.
        return callback({data: err, code: 1}, false);
      }

      var Session = require('express/node_modules/connect/lib/middleware/session').Session,
          Cookie = require('express/node_modules/connect/lib/middleware/session/cookie');

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
          if (err || !session || !session.passport || !session.passport.user
            || !session.passport.user.id
            || !session.passport.user.organization
            || !session.passport.user.username
            || !session.cookie || !session.cookie.expires) {

            // TODO - Destroy expired session in the db and cache.

            // Tell the client it timed out. This will redirect the client to /logout
            // which will destroy the session, but we can't rely on the client for that.
            socket.emit("timeout");
            return socket.disconnect();
          }

          // Make sure the sesion hasn't expired yet.
          expires = new Date(session.cookie.expires);
          current = new Date();
          if (expires <= current) {
            // TODO - Destroy expired session in the db and cache.

            // Tell the client it timed out. This will redirect the client to /logout
            // which will destroy the session, but we can't rely on the client for that.
            socket.emit("timeout");
            return socket.disconnect();
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
  // when a session is timed out. That should nodify the client imediately they have timed out.
  socket.handshake.session.socket = {id: socket.id};
  socket.handshake.session.save();

  // To run this from the client:
  // ???
  socket.on('session', function (data, callback) {
    ensureLoggedIn(function (session) {
      callback({data: session.passport.user, code: 1});
    }, data && data.payload);
  });

  // To run this from the client:
  // XT.dataSource.retrieveRecord("XM.State", 2, {"id":2,"cascade":true,"databaseType":"instance"});
  socket.on('function/retrieveRecord', function (data, callback) {
    ensureLoggedIn(function (session) {
      routes.retrieveEngine(data.payload, session, callback);
    }, data && data.payload);
  });

  // To run this from client:
  // XT.dataSource.fetch({"query":{"orderBy":[{"attribute":"code"}],"recordType":"XM.Honorific"},"force":true,"parse":true,"databaseType":"instance"});
  socket.on('function/fetch', function (data, callback) {
    ensureLoggedIn(function (session) {
      routes.fetchEngine(data.payload, session, callback);
    }, data && data.payload);
  });

  // To run this from client:
  // XT.dataSource.dispatch("XT.Session", "settings", null, {success: function () {console.log(arguments);}, error: function () {console.log(arguments);}});
  socket.on('function/dispatch', function (data, callback) {
    ensureLoggedIn(function (session) {
      routes.dispatchEngine(data.payload, session, callback);
    }, data && data.payload);
  });

  // To run this from the client:
  // ???
  // TODO: The first argument to XT.dataSource.commit() is a model and therefore a bit tough to mock
  // XXX untested
  socket.on('function/commitRecord', function (data, callback) {
    ensureLoggedIn(function (session) {
      routes.commitEngine(data.payload, session, callback);
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

// Load XTPGStore into MemoryStore at startup for caching.
    // TODO - If we ever run multiple processes/servers, MemoryStore must be replaced with something
    // all processes/servers can use/share and keep in sync like Redis.
// TODO - Call XTPGStore loadCache function.
// See sessionObjectLoaded() above were this is for now.
//sessionStore.loadCache();

// TODO - Check pid file to see if this is already running.
// Kill process or create new pid file.


// TODO - Load the session first and get the socket.id so it can be disconnected.
// TODO - Destroy expired session in the db and cache.
    // This code will loop through all socket.io connections and emit the "timeout" event
    // which tells the client immediately it has timed out.
    // Now we just need to filter that my timed out session's socket.ids
    /*
    _.each(io.sockets.sockets, function (val, key, list) {
      _.each(val.manager.namespaces, function (spaceVal, spaceKey, spaceList) {
        val.flags.endpoint = spaceVal.name;
        val.emit("timeout");
      })
      val.disconnect();
    });
    */
