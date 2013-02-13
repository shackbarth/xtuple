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

  var secondsToWait = 10;

  var loadApp = function (username, password, host, masterCallback) {
    var siteRoot = host || 'https://localhost';
    zombie.visit(siteRoot, {debug: false}, function (e, browser) {
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

          // Plan to give up after a set time
          setTimeout(function () {
            masterCallback();
          }, secondsToWait * 1000);

          // Check frequently to see if the app is loaded, and move forward when it is
          setInterval(function () {
            if (browser.window.XT && browser.window.XT.app && browser.window.XT.app.state === 6) {
              // add the global objects to our global namespace
              XM = browser.window.XM;
              XT = browser.window.XT;
              XV = browser.window.XV;

              // give control back to whoever called us
              masterCallback();
            }
          }, 100);
        });
    });
  };

  exports.loadAdd = loadApp;

  exports.testLoad = function (username, password, host) {
    console.log("Testing loadup of app.");

    loadApp(username, password, host, function () {
      if (!XT || !XT.app || !XT.app.state || XT.app.state < 6) {
        console.log("App did not fully load");
        process.exit(1);
      }
      console.log("App loaded successfully.");
      process.exit(0);
    });
  };

}());

