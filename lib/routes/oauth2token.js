/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, XM:true */

(function () {
  "use strict";

  var _fs = X.fs, _path = X.path;

  /**
    Defines the authentication route.

    @extends X.Route
    @class
   */
  X.oauth2tokenRoute = X.Route.create({
    handle: function (xtr) {
      var data = xtr.get("payload"),
        options = {},
        message = "OAuth 2.0 Token endpoint",
        that = this;

      //X.debugging = true;
      //X.debug(data);

      // Server to Server Grant:
      // This extended grant type comes from Google:
      // https://developers.google.com/accounts/docs/OAuth2ServiceAccount
      // This grant type is used by xTuple's Drupal sites to gain access to the REST API.
      // This grant type also allows for delegated access where Drupal can request resources
      // as a specific user. This enforces that user's permissions when performaing any CRUD.
      //  1. Admin user registers the client server (Drupal) as an xTuple OAuth "Service Account".
      //  2. A private key and client_id are returned to the Admin user.
      //  3. The Admin user save the private key and client_id where Drupal can access it.
      //  4. Application code on Drupal creates a JWT and signs it with the private key.
      //  5. Application code on Drupal submits the JWT as an access token request to the auth server.
      //  6. If the JWT is valid, auth server responds with a Access Token.
      //  7. Drupal uses the Access Token for all further requests.
      //  8. When the access token expires, application code on Drupal repeats step 4 - 7.

      options.success = function () {
        xtr.write(session.get("details")).close();
      };
      options.error = function (err) {
        xtr.error({isError: true, reason: message});
      };
      //options.id = data.id;
      options.username = X.options.globalDatabase.nodeUsername;
      //user.fetch(options);

      xtr.write(message).close();
    },

    handles: "/oauth2/token".w(),
    needsSession: false
  });
}());
