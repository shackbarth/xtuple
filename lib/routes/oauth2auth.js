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
  X.oauth2authRoute = X.Route.create({
    handle: function (xtr) {
      var data = xtr.get("payload"),
        options = {},
        message = "OAuth 2.0 Authorization endpoint",
        that = this;

      //X.debugging = true;
      //X.debug(data);

// Authorization Grant Types:
// http://tools.ietf.org/html/rfc6749#section-4
// The following sections support different grant types. The OAuth 2.0 spec
// allows for grant types to be extended to support just about any scenario.

      // Authorization Code Grant:
      // http://tools.ietf.org/html/rfc6749#section-4.1
      // We do not support this grant type. See the extended version in
      // Installed Applications Grant below.

      // Implicit Grant:
      // http://tools.ietf.org/html/rfc6749#section-4.2
      // We do not support this grant type. It is not very secure.
      // It would be useful for read only public services like
      // Google's MAP API.

      // Resource Owner Password Credentials Grant:
      // http://tools.ietf.org/html/rfc6749#section-4.3
      // This grant type is (WILL BE) used by the mobile client, but could be used by external client.
      // Since the login credentials are entered in whatever client uses this grant type,
      // the client MUST be highly trusted. It should not store the login credentials.
      // Because of this security concern, no refresh token is grated by this type.
      // See Installed App Grant below if you need a refresh token.
      //  1. Client presents user with login form.
      //  2. User enters login credentials.
      //  3. Client POSTs the credentials to this auth server.
      //  4. Auth server checks credentials against the database.
      //  5. If credentials are valid, auth server responds with an Access Token.
      //  6. The client then MUST validate the token:
      //    https://developers.google.com/accounts/docs/OAuth2Login#validatingtoken
      //  7. If the token is valid, the client takes the Access Token and stores it in a session cookie.
      //  8. Client uses the Access Token for all further requests.
      //  9. When the Access Token expires, the client must login again.
      if (data.grant_type && data.grant_type === 'password') {

      }

      // Client Credentials Grant:
      // http://tools.ietf.org/html/rfc6749#section-4.4
      // We do not support this grant type. It is not very secure.
      // This grant requires the login credentials of the user be stored on the client.
      // Some mobile apps use this and save you password in plaintext.

      // Server to Server Grant:
      // This extended grant type comes from Google:
      // https://developers.google.com/accounts/docs/OAuth2ServiceAccount
      // This grant type is handled by the oauth2tokenRoute since it bypasses authentication by using a JWT.

      // Installed Applications Grant:
      // This extended grant type comes from Google:
      // https://developers.google.com/accounts/docs/OAuth2InstalledApp
      // This grant type can be used by a mobile app or another website.
      // This grant type requires the user to login through our site which
      // is considered secure, so a refresh token will be issued.
      // In android, an account type can be added:
      // http://developer.android.com/training/id-auth/custom_auth.html
      // The app will use this grant type to sign in and get an access token.
      //  1. User installs a TBD Tuple Mobile App on their phone.
      //  2. User goes to "Add Account" on their phone.
      //  3. User select "xTuple" as account type (From the xTuple Mobile App that was installed).
      //  4. The xTuple login page is displayed and the User is prompted for login credentials and enters them.
      //  5. Auth server checks credentials against the database.
      //  6. If credentials are valid, auth server responds with an Authorization Code.
      //    Note: All device OS's handle this differently. See: https://developers.google.com/accounts/docs/OAuth2InstalledApp#choosingredirecturi
      //  7. App receives an Authorization Code and POSTS it to exchange for Tokens.
      //  8. App receives an Access Token and a Refresh Token and persists the Refresh Token.
      //  9. When the Access Token expires, the App uses it's Refresh Token to request a new Access Token.
      else if (data.response_type && data.response_type === 'code') {

      }

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

    handles: "/oauth2/auth /oauth2/token".w(),
    needsSession: false
  });
}());
