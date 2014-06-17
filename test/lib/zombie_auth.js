/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true, XM:true, XV:true, XZ:true, enyo:true, XG:true */

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

// global objects
enyo = {};
XT = {};
XG = {};
XM = {};
XV = {};
XZ = {}; // xTuple Zombie. Used to help zombie within the context of these tests.

global.URL = require('url');

var assert = require('assert'),
  Browser = require('zombie'),
  _ = require('underscore');

(function () {

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

    /**
     * XXX
     * horrendous hackery to make zombie 1.4.1 work in node 0.10.x
     */
    var resolve = URL.resolve;
    URL.resolve = function (base, path) {
      if (_.isObject(base) && !_.isEmpty(base.href)) {
        return resolve(base.href.toString(), path);
      }
      else {
        return resolve(base, path);
      }
    };

    var browser = new Browser({
      runScripts: false,
      site: host,
      maxWait: 30 * 1000
    });

    browser
      .visit(host)
      .then(function (e) {
        if (e) {
          console.log("Zombie visit error: ", e);
        }
        //
        // This is the login screen
        //
        browser.fill('id', username);
        browser.fill('password', password);
        browser.select('database', database);
      })
      .then(function () {
        browser.runScripts = true;
        return browser.pressButton('Sign In');
      })
      .then(function () {
        // Check frequently to see if the app is loaded, and move forward when it is
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
              if (message && _.isFunction(message.toLowerCase) && message.toLowerCase().indexOf("error") === 0) {
                // errors from the datasource should cause the test to fail
                assert.fail(message + " " + JSON.stringify(obj));
              }
              // log if verbose mode or if the log is a warning
              if (verboseMode || (message && message.code)) {
                console.log(JSON.stringify(arguments));
              }
            };

            // these are really annoying
            browser.window.Backbone.Relational.showWarnings = false;

            // clear out both is interval and the I'm-giving-up timeout
            // we really want neither to be run again.
            clearInterval(interval);

            // give control back to whoever called us
            callback();
          }
        }, 500); // 100 = check to see if the app is loaded every 0.1 seconds
      });
  };
}());
