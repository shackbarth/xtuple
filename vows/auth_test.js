/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true */

XT = {};

var assert = require('assert'),
  zombie = require('zombie');
(function () {
  "use strict";

  zombie.visit('http://localhost:2000', {debug: false}, function (e, browser) {
    //
    // This is the login screen
    //
    browser
      .fill('id', 'admin')
      .fill('password', 'somenew')
      .pressButton('submit', function () {
        //
        // We skip the scope screen because we're using a user that only has one org
        //

        // Note: make sure the app is BUILT

        // not quite sure why zombie doesn't do this redirect, but oh well.
        browser.visit('http://localhost:2000/client/index.html', function (e, browser) {
          //console.log(browser.errors);
          function appIsReady(window) {
            return window.XT.app.state === 6;
          }
          browser.wait(appIsReady, function () {
            XT = browser.window.XT;

            //console.log(XT.session.schema);
            //console.log(XT.session.schema.toJSON());
            //console.log(JSON.stringify(XT.session.extensions));
            process.exit(0);
          });
        });
      });
  });

}());

