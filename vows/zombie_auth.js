/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true, XM:true, XV: true */

// global objects
XT = {};
XM = {};
XV = {};

var assert = require('assert'),
  zombie = require('zombie');


/**
Usage:

<pre><code>
  var zombieTest = require('./vows/zombie_auth');
  zombieTest.testLoad('username', 'password');
</code></pre>
*/
(function () {
  "use strict";

  var loadApp = function (username, password, host, masterCallback) {
    zombie.visit(host || 'http://localhost', {debug: false}, function (e, browser) {
      //
      // This is the login screen
      //
      browser
        .fill('id', username)
        .fill('password', password)
        .pressButton('submit', function () {
          //
          // We skip the scope screen because we're using a user that only has one org
          //
          // Note: make sure the app is built

          // not quite sure why zombie doesn't do this redirect, but oh well.
          browser.visit('http://localhost/client/index.html', function (e, browser) {
            browser.wait(function (window) {
              // this function defines what we're waiting for: for the app state to be 6 (= RUNNING)
              return window.XT.app.state === 6;
            }, function () {
              // this is the function that gets run when the above function returns true

              // add the global objects to our global namespace
              XM = browser.window.XM;
              XT = browser.window.XT;
              XV = browser.window.XV;

              // give control back to whoever called us
              masterCallback();
            });
          });
        });
    });
  };

  exports.loadAdd = loadApp;

  exports.testLoad = function (username, password, host) {
    var secondsToWait = 10;
    console.log("Testing loadup of app.");

    setTimeout(function () {
      console.log("App did not load in " + secondsToWait + " seconds.");
      process.exit(1);
    }, secondsToWait * 1000);

    loadApp(username, password, host, function () {
      console.log("App loaded successfully.");
      process.exit(0);
    });
  };

}());

