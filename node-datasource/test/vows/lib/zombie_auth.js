/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true, XM:true, XV: true */

// global objects
enyo = {};
XT = {};
XM = {};
XV = {};
XZ = {}; // xTuple Zombie. Used to help zombie within the context of these tests.

var assert = require('assert'),
  zombie = require('zombie');


/**
Simplest possible usage:

  var zombieTest = require('./zombie_auth');
  zombieTest.testLoad();
*/
(function () {
  "use strict";

  var secondsToWait = 20;

  /**
    Loads up the xTuple environment and makes the global variables globally available.

    The first three options are optional, but if omitted then the login data should be
    available in the /test/shared/loginData.js file.

    There are two important limitations to this code at the moment. First, the client-side
    app must be built. (Going in through debug.html won't work). Second, you have to
    use a user who is only associated with one organization. Both of these limitations
    should be fixed when we get a chance.

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
        loginData = require('../../shared/loginData');
      } catch (err) {
        console.log("Make sure you put your login credentials in the /test/shared/loginData.js file");
        process.exit(1);
      }

      username = loginData.data.username;
      password = loginData.data.pwd;
      host = loginData.data.webaddress;
    }
    host = host || "https://localhost:443";

    // when we run all our tests we only want to have to log in for the first one
    if (XT.app) {
      if (verboseMode) {
        console.log("Using pre-existing zombie session");
      }
      callback();
      return;
    }

    zombie.visit(host, {debug: false}, function (e, browser) {
      //
      // This is the login screen
      //
      browser
        .fill('id', username)
        .fill('password', password)
        .pressButton('submit', function () {

          //
          // We skip the scope screen because we're using a user that only has one org
          // XXX this limitation should be fixed, to allow a test on users with >1 org

          // Note: make sure the app is built
          // XXX this limitation should be fixed, to allow testing off of debug.html

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
              XM = browser.window.XM;
              XT = browser.window.XT;
              XV = browser.window.XV;
              XZ.browser = browser;

              XT.log = function (message) {
                // log if verbose mode or if the log is an error
                if (verboseMode || (message && message.code)) {
                  console.log(JSON.stringify(arguments));
                }
              };

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

