/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true */

(function () {
  "use strict";

  var options = require("./lib/options");

  // include the XT framework
  require("xt");

  // make absolutely sure we're going to start
  options.autoStart = true;

  XT.debugging = true;

  // set the options
  XT.setup(options);

  require("./lib/ext/session");
  require("./lib/ext/proxy");
  require("./lib/ext/database");

  // load up the dataserver
  require("./lib/dataserver");
  
  // load up the redirector
  
  XT.userCache = XT.Cache.create({prefix: "users"});
  XT.sessionCache = XT.Cache.create({
    prefix: "session",
    init: function () {
      this._super.init.call(this);
      XT.Session.cache = this;
    }
  });
}());