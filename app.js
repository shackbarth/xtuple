#!/usr/bin/env node

/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, Backbone:true, _:true, XM:true, XT:true*/

/**
 * Global dependencies.
 */
Backbone = require("backbone");
_ = require("underscore");

/**
 * Module dependencies.
 */
var express = require('express'),
    passport = require('passport'),
    site = require('./oauth2/site'),
    oauth2 = require('./oauth2/oauth2'),
    user = require('./oauth2/user'),
    options = require("./lib/options");

/**
 * Express configuration.
 */
var app = express();

app.configure(function(){

  app.set('view engine', 'ejs');
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.session({ secret: '.T#T@r5EkPM*N@C%9K-iPW!+T' }));

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

/**
 * Passport configuration.
 */
require('./oauth2/passport');

app.get('/', site.index);
app.get('/login', site.loginForm);
app.post('/login', site.login);
app.get('/logout', site.logout);
app.get('/account', site.account);

app.get('/dialog/authorize', oauth2.authorization);
app.post('/dialog/authorize/decision', oauth2.decision);
app.post('/oauth/token', oauth2.token);

app.get('/api/userinfo', user.info);

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

// Other xTuple libraries.
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

// Another hack: quiet the logs here
XT.log = function () {};

// Make absolutely sure we're going to start.
options.autoStart = true;

X.debugging = true;

// Set the options and start the servers the OLD way.
X.setup(options);

// Start the express server.
app.listen(2000);