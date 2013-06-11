/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, SYS:true, console:true*/

/**
 * Find an issued auth code in the database.
 *
 * @param {string} Auth code send from a client.
 * @param {Function} Function to call the move along.
 */
exports.find = function (code, database, done) {
  "use strict";

  var authCode = new SYS.Oauth2tokenCollection(),
      options = {};

  options.success = function (res) {
    // We should only get one record back matching the authCode.
    if (res.models.length !== 1) {
      var message = "Error fetching OAuth 2.0 authenticating code.";
      X.log(message);

      // No match or multiple which is not allowed. Send nothing.
      return done(new Error(message));
    }

    // Send that SYS.Oauth2token model along.
    return done(null, res.models[0]);
  };

  options.error = function (err, res) {
    if (err.code === 'xt1007') {
      // XXX should "result not found" really be an error?
      return done(null, null);
    } else {
      var message = "Error authenticating OAuth 2.0 authenticating code.";
      X.log(message);
      return done(new Error(message));
    }
  };

  options.database = database;

  // Fetch the collection looking for a matching authCode.
  options.query = {};
  options.query.parameters = [{attribute: "authCode", value: code}];
  authCode.fetch(options);
};

/**
 * Save an auth code to the database.
 *
 * @param {string} Auth code send from a client.
 * @param {string} OAuth 2.0 client ID.
 * @param {string} Redirect URI to reply to the client at.
 * @param {string} User id/name.
 * @param {string} Scope/org the auth code and tokens will be valid for.
 * @param {Function} Function to call the move along.
 */
exports.save = function (code, clientID, redirectURI, userID, scope, done) {
  "use strict";

  var authCode = new SYS.Oauth2token(),
      saveOptions = {},
      today = new Date(),
      expires = new Date(today.getTime() + (10 * 60 * 1000)), // 10 minutes from now.
      initCallback = function (model, value) {
        if (model.id) {
          // Now that model is ready, set attributes and save.
          var codeAttributes = {
            user: userID,
            clientID: clientID,
            redirectURI: redirectURI,
            scope: JSON.stringify(scope),
            state: "Auth Code Issued",
            authCode: code,
            authCodeIssued: today,
            authCodeExpires: expires,
            tokenType: "bearer"
          };

          // Try to save auth code data to the database.
          model.save(codeAttributes, saveOptions);
        } else {
          return done && done(new Error('Cannot save authenticating code. No id set.'));
        }
      };

  saveOptions.success = function (model) {
    return done(null);
  };
  saveOptions.error = function (err, model) {
    return done && done(err);
  };
  saveOptions.database = scope[0];

  // Register on change of id callback to know when the model is initialized.
  authCode.on('change:id', initCallback);

  // Initialize the model.
  authCode.initialize(null, {isNew: true, database: saveOptions.database});
};
