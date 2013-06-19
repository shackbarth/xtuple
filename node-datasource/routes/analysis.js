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
    var url, reportUrl = req.query.reportUrl,
      username = req.user.id,
      biServerUrl = X.options.datasource.biServerUrl,
      today = new Date(),
      expires = new Date(today.getTime() + (10 * 60 * 1000)), // 10 minutes from now
      claimSet = {
        //"iss": "", // client-identifier
        //"jti": "" // unique JWT ID
        "prn": username, // username
        "scope": "",
        "aud": "",
        "datasource": "", // rest api url
        "exp": Math.round(expires.getTime() / 1000), // expiration date in millis
        "iat": Math.round(today.getTime() / 1000)  // created date in millis
      };
    // TODO: sign and encode this JWT
    claimSet = JSON.stringify(claimSet);

    url = biServerUrl + reportUrl + "&assertion=" + claimSet;
    res.send(url);
  };

}());
