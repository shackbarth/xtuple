/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

(function () {
  "use strict";

  var options = require("./lib/options");

  // include the X framework
  require("xt");

  // make absolutely sure we're going to start
  options.autoStart = true;

  X.debugging = true;

  // set the options
  X.setup(options);

  require("./lib/ext/session");
  require("./lib/ext/proxy");
  require("./lib/ext/database");

  // load up the dataserver
  require("./lib/dataserver");
  
  // load up the redirector
  
  X.userCache = X.Cache.create({prefix: "users"});
  X.sessionCache = X.Cache.create({
    prefix: "session",
    init: function () {
      this._super.init.call(this);
      X.Session.cache = this;
    }
  });
}());
