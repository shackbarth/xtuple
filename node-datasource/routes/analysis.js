/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, _:true, SYS:true */

(function () {
  "use strict";

  /**
    Generates a JSON Web Token (JWT) to be appended to the
    BI Server URL so that it may authenticate the current user.
  */
  exports.analysis = function (req, res) {
    var reportUrl = req.query.reportUrl,
      username = req.session.passport.user.username,
      biServerUrl = X.options.datasource.biServerUrl,
      today = new Date(),
      expires = new Date(today.getTime() + (10 * 60 * 1000)), // 10 minutes from now
      datasource = req.headers.host,
      database = req.session.passport.user.organization,
      scope = "/auth/" + database,
      audience = "/oauth/token",
      privKey = X.fs.readFileSync(X.options.datasource.biKeyFile),
      claimSet = {
        //"iss": "", // client-identifier, not needed?
        "prn": username, // username
        "scope": scope,
        "aud": audience,
        "datasource": datasource, // rest api url
        "exp": Math.round(expires.getTime() / 1000), // expiration date in millis
        "iat": Math.round(today.getTime() / 1000)  // created date in millis
      };

    claimSet = JSON.stringify(claimSet);

    // send newly formed BI url back to the client
    res.setHeader("Content-Type", "application/json");
    res.send(biServerUrl + reportUrl + "&assertion=" + claimSet);
  };
}());
