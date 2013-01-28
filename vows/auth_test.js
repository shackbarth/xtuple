/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

var assert = require('assert'),
  zombie = require('zombie');
(function () {
  "use strict";

/*
  zombie.visit('http://enyojs.com/sampler/', function (e, browser) {
    console.log(arguments);
    console.log(browser.errors);
    console.log(browser.text('title'));

  });
*/
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

        //console.log(arguments);
        //console.log(browser.text('title'));

        browser.visit('http://localhost:2000/client/index.html', function (e, browser) {
          console.log(typeof enyo);
          console.log(browser.errors);
          browser.wait(function () {
            console.log("App is loaded");
            console.log(browser.window.XT.app.state);
          });
        });
      });
  });

}());

