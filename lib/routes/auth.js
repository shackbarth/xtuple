/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

(function () {
  "use strict";

  var _fs = X.fs, _path = X.path, salt, crypt;

  // TODO: THIS HAS TO CHANGE FOR RELEASE THIS MUST BE GLOBALLY AVAILABLE
  // TO ALL DATASOURCES [ed. note: plural of datasource is datasources]
  salt = _fs.readFileSync(_path.join(X.basePath, X.options.datasource.saltFile), "utf8").trim();

  crypt = function (password) {
    var md5 = X.crypto.createHash('md5');
    md5.update(salt + password);
    return md5.digest('hex');
  };

  /**
    Defines the authentication route.

    @extends X.Route
    @class
   */
  X.authRoute = X.Route.create({
    handle: function (xtr) {
      var data = xtr.get("payload"), K = this.get("model"), session;
      
      //X.debugging = true;
      //X.debug(data);
      // For Mobile Safari issue#18707
      delete data.timeStamp;
      
      if (!data || !data.password) {
        xtr.error({isError: true, reason: "invalid password"});
      } else {
        data.password = crypt(data.password);
        K.findOne(data, ["id", "organizations.name", "organizations.username"], function (err, res) {
          if (err) {
            xtr.error({isError: true, reason: err});
          } else {
            if (!res) xtr.error({isError: true, reason: "unknown user or invalid password match"});
            else {
              delete res.password;
              //X.debug("authed: ", res.toObject());
              session = X.Session.create(res.toObject());
              session.once("isReady", function () {
                xtr.write(session.get("details")).close();
              });
            }
          }
        });
      }
    },
    model: function () {
      return X.userCache.model("User");
    }.property(),
    handles: "login/authenticate /login/authenticate".w(),
    needsSession: false
  });
}());
