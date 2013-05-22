/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, SYS:true, console:true*/

/**
 * Find an matching client by id in the database.
 *
 * @param {string} Database client id field.
 * @param {Function} Function to call the move along.
 */
exports.find = function (sentClient, done) {
  "use strict";

  var client = new SYS.Oauth2clientCollection(),
      options = {};

  options.success = function (res) {
    if (res.models.length !== 1) {
      var message = "Error fetching OAuth 2.0 client.";
      X.log(message);
      return done(null, null);
    }

    return done(null, res.models[0]);
  };

  options.error = function (res, err) {
    if (err.code === 'xt1007') {
      // XXX should "result not found" really be an error?
      return done(null, null);
    } else {
      var message = "Error validating OAuth 2.0 client.";
      X.log("Error validating OAuth 2.0 client.");
      return done(new Error(message));
    }
  };
  options.database = sentClient.organization;

  options.query = {};
  options.query.parameters = [{attribute: "id", value: sentClient.id}];

  client.fetch(options);
};

/**
 * Find an matching client by clientID in the database.
 *
 * @param {string} OAuth 2.0 client ID.
 * @param {Function} Function to call the move along.
 */
exports.findByClientId = function (clientID, database, done) {
  "use strict";

  var client = new SYS.Oauth2clientCollection(),
      options = {};

  options.success = function (res) {
    if (res.models.length !== 1) {
      var message = "Error fetching OAuth 2.0 client.";
      X.log(message);
      return done(null, null);
    }

    return done(null, res.models[0]);
  };

  options.error = function (res, err) {
    if (err.code === 'xt1007') {
      // XXX should "result not found" really be an error?
      return done(null, null);
    } else {
      var message = "Error validating OAuth 2.0 client.";
      X.log("Error validating OAuth 2.0 client.");
      return done(new Error(message));
    }
  };

  options.query = {};
  options.query.parameters = [{attribute: "clientID", value: clientID}];
  options.database = database;

  client.fetch(options);
};

// TODO - Need an admin iterface that can add new clients.
// TODO - Need a save function for that admin interface to call.
// TODO - client_id MUST be atleast 22 characters long for use in bcrypt salt.
