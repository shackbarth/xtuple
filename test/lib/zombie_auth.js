/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true, XM:true, XV:true, XZ:true, enyo:true, XG:true */

var _ = require('underscore');
global.URL = require('url');
var parse = global.URL.parse;
var resolve = global.URL.resolve;
global.URL.parse = function (url) {
  "use strict";
  console.log('URL.parse', url);
  if (_.isObject(url) && _.isString(url.href)) {
    return parse(url.href);
  }
  else {
    return parse(url);
  }
};
global.URL.resolve = function (from, to) {
  "use strict";
  console.log('URL.resolve from', from);
  console.log('URL.resolve to', to);
  if (_.isObject(from)) {
    from = from.href || '/';
  }
  if (_.isObject(to)) {
    to = to.href || '';
  }

  return resolve(from, to);
};


// global objects
enyo = {};
XT = {};
XG = {};
XM = {};
XV = {};
XZ = {}; // xTuple Zombie. Used to help zombie within the context of these tests.

// https://github.com/mikeal/request/issues/418#issuecomment-17149236
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var assert = require('assert'),
  zombie = require('zombie'),
  _ = require('underscore');


/**
Simplest possible usage:

  var zombieTest = require('./zombie_auth');
  zombieTest.testLoad();
*/
(function () {
  "use strict";

  var secondsToWait = 40;

  /**
    Loads up the xTuple environment and makes the global variables globally available.

    The first three options are optional, but if omitted then the login data should be
    available in the /test/lib/loginData.js file.

    There is one important limitation to this code at the moment: the client-side
    app must be built. (Going in through debug.html won't work).

    @param {Object} options
    @param {String} options.username
    @param {String} options.password
    @param {String} options.host
    @param {Boolean} options.verbose
    @param {Function} options.callback. This function will be called with the zombie browser
      as a parameter if the app loads up successfully.

    Supported signatures are:
    loadApp(callback);
    loadApp({username: "admin", password: "somenew", callback: callback});
    loadApp({callback: callback, verbose: true});
  */
  var loadApp = exports.loadApp = function (options) {
    options = options || {};

    var username = options.username,
      password = options.password,
      database = options.database,
      host = options.host,
      callback = options.callback,
      verboseMode = options.verbose,
      loginData;

    //
    // Handle multiple signatures
    //
    if (typeof arguments[0] === 'function') {
      // if the sole parameter is the callback, then we get the auth data from a file
      callback = arguments[0];
    }

    if (!username || !password) {
      try {
        loginData = require(options.loginDataPath || './login_data');
      } catch (err) {
        console.log("Make sure you put your login credentials in the /test/lib/login_data.js file");
        process.exit(1);
      }

      username = loginData.data.username;
      password = loginData.data.pwd;
      database = loginData.data.org;
      host = loginData.data.webaddress;
    }
    host = host || "https://localhost:443";

    if (options.refreshLogin) {
      enyo = {};
      XT = {};
      XM = {};
      XV = {};
      XZ = {};
    }

    // when we run all our tests we only want to have to log in for the first one
    if (XT.app) {
      if (verboseMode) {
        console.log("Using pre-existing zombie session");
      }
      callback();
      return;
    }


    zombie.visit(host, {debug: verboseMode, runScripts: false}, function (e, browser) {
      if (e) {
        console.log("Zombie visit error: ", e);
      }
      //
      // This is the login screen
      //
      browser.runScripts = true;
      browser
        .fill('id', username)
        .fill('password', password)
        .select('database', database)
        .pressButton('submit', function () {

          // Note: make sure the app is built
          // XXX this limitation should be fixed, to allow testing off of debug.html
          // it's possible that Zombie 2.0 will get this right.

          //
          // Plan to give up after a set time
          //
          var timeout = setTimeout(function () {
              console.log("App did not fully load");
              process.exit(1);
            }, secondsToWait * 1000);

          //
          // Check frequently to see if the app is loaded, and move forward when it is
          //
          var interval = setInterval(function () {

            if (browser.window.XT && browser.window.XT.app && browser.window.XT.app.state === 6) {

              // add the global objects to our global namespace
              enyo = browser.window.enyo;
              XG = browser.window.XG;
              XM = browser.window.XM;
              XT = browser.window.XT;
              XV = browser.window.XV;
              XZ.browser = browser;
              XZ.host = host;
              XZ.database = database;

              XT.log = function (message, obj) {
                if (message && message.toLowerCase().indexOf("error") === 0) {
                  // errors from the datasource should cause the test to fail
                  assert.fail(message + " " + JSON.stringify(obj));
                }
                // log if verbose mode or if the log is a warning
                if (verboseMode || (message && message.code)) {
                  console.log(JSON.stringify(arguments));
                }
              };

              /*
              var oldNotify = XT.app.$.postbooks.notify;
              XT.app.$.postbooks.notify = function (notifySender, notifyObj) {
                if (notifyObj && notifyObj.type === XM.Model.CRITICAL) {
                  assert.fail(JSON.stringify(notifyObj));
                } else {
                  oldNotify(notifySender, notifyObj);
                }
              };
              */
              // WIP. Not yet working. Probably need to move it up to earlier app start status.
              /*
              var oldLoc = XT.String.loc;
              XT.String.loc = function (str) {
                var localized = XT.localizeString(str);
                if (localized === str) {
                  assert.fail(str + " has no translation");
                } else {
                  oldLoc(str);
                }
              };
              */

              // these are really annoying
              browser.window.Backbone.Relational.showWarnings = false;

              // clear out both is interval and the I'm-giving-up timeout
              // we really want neither to be run again.
              clearInterval(interval);
              clearTimeout(timeout);

              // give control back to whoever called us
              callback();
            }
          }, 100); // 100 = check to see if the app is loaded every 0.1 seconds
        });
    });
  };

  /**
    More of a proof-of-concept than anything else.
   */
  var testLoad = exports.testLoad = function () {
    console.log("Testing loadup of app.");

    loadApp(function () {
      console.log("App loaded successfully.");
      process.exit(0);
    });
  };

}());
