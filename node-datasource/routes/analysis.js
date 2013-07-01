/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, _:true, SYS:true */

(function () {
  "use strict";

  var utils = require('../oauth2/utils');

  /**
    Generates a JSON Web Token (JWT) to be appended to the
    BI Server URL so that it may authenticate the current user.
  */
  exports.analysis = function (req, res) {
    var jwt,
      privKey = "",
      claimSet = {},
      header = {},
      reportUrl = req.query.reportUrl,
      username = req.session.passport.user.username,
      biServerUrl = X.options.datasource.biServerUrl,
      today = new Date(),
      expires = new Date(today.getTime() + (10 * 60 * 1000)), // 10 minutes from now
      datasource = "https://" + req.headers.host + "/",
      database = req.session.passport.user.organization,
      scope = datasource + database + "/auth/" + database,
      audience = datasource + database + "/oauth/token";

    // get private key from path in config
    privKey = X.fs.readFileSync(X.options.datasource.biKeyFile);

    // create header for JWT
    header = {
      "alg": "RS256",
      "type": "JWT"
    };

    // create claimSet for JWT
    claimSet = {
      "prn": username, // username
      "scope": scope,
      "aud": audience,
      "org": database,
      "datasource": datasource, // rest api url
      "exp": Math.round(expires.getTime() / 1000), // expiration date in millis
      "iat": Math.round(today.getTime() / 1000)  // created date in millis
    };

    // encode and sign JWT with private key
    jwt = encodeJWT(JSON.stringify(header), JSON.stringify(claimSet), privKey);
    // send newly formed BI url back to the client
    res.send(biServerUrl + reportUrl + "&assertion=" + jwt.jwt);
  };

  var encodeJWT = function (header, claimSet, key) {
    var encodeHeader,
      encodeClaimSet,
      signer,
      signature,
      data,
      jwt;

    // if there is a problem encoding/signing the JWT, then return invalid
    try {
      encodeHeader = utils.base64urlEncode(JSON.stringify(JSON.parse(header)));
      encodeClaimSet = utils.base64urlEncode(JSON.stringify(JSON.parse(claimSet)));
      data = encodeHeader + "." + encodeClaimSet;

      signer = X.crypto.createSign("RSA-SHA256");
      signer.update(data);
      signature = utils.base64urlEscape(signer.sign(key, "base64"));
      jwt = {
        jwt: data + "." + signature
      };

    } catch (error) {
      jwt = {
        jwt: "invalid"
      };
    }

    return jwt;
  };

}());
