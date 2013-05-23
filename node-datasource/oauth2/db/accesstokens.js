/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, SYS:true, console:true*/

exports.findByAccessToken = function (key, database, done) {
  "use strict";

  var code = new SYS.Oauth2tokenCollection(),
      options = {};

  options.success = function (res) {
    if (res.models.length !== 1) {
      var message = "Error fetching OAuth 2.0 access token.";
      X.log(message);
      return done(null, null);
    }

    return done(null, res.models[0]);
  };

  options.error = function (err, res) {
    if (err.code === 'xt1007') {
      // XXX should "result not found" really be an error?
      return done(null, null);
    } else {
      var message = "Error validating OAuth 2.0 access token.";
      X.log(message);
      return done(new Error(message));
    }
  };

  options.database = database;

  options.query = {};
  options.query.parameters = [{attribute: "accessToken", value: key}];

  code.fetch(options);
};

exports.findByRefreshToken = function (key, database, done) {
  "use strict";

  var code = new SYS.Oauth2tokenCollection(),
      options = {};

  options.success = function (res) {
    if (res.models.length !== 1) {
      var message = "Error fetching OAuth 2.0 refresh token.";
      X.log(message);
      return done(null, null);
    }

    return done(null, res.models[0]);
  };

  options.error = function (err, res) {
    if (err.code === 'xt1007') {
      // XXX should "result not found" really be an error?
      return done(null, null);
    } else {
      var message = "Error validating OAuth 2.0 refresh token.";
      X.log(message);
      return done(new Error(message));
    }
  };

  options.database = database;

  options.query = {};
  options.query.parameters = [{attribute: "refreshToken", value: key}];

  code.fetch(options);
};
