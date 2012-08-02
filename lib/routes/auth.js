/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true */

(function () {
  "use strict";
  
  var _fs = XT.fs, _path = XT.path, salt, crypt;
  
  // TODO: THIS HAS TO CHANGE FOR RELEASE THIS MUST BE GLOBALLY AVAILABLE
  // TO ALL DATASOURCE...DATASOURCES...DATASOURCAI...$#&@$ it
  salt = _fs.readFileSync(_path.join(XT.basePath, XT.options.datasource.secureSaltFile), "utf8").trim();
  
  crypt = function (password) {
    var md5 = XT.crypto.createHash('md5');
    md5.update(salt + password);
    return md5.digest('hex');
  };
  
  XT.authRoute = XT.Route.create({
    handle: function (xtr) {
      var data = xtr.get("payload"), K = this.get("model"), session;     
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
              //XT.debug("authed: ", res.toObject());
              session = XT.Session.create(res.toObject());
              session.once("isReady", function () {
                xtr.write(session.get("details")).close();
              });
            }
          }
        });
      }
    },
    model: function () {
      return XT.userCache.model("User");
    }.property(),
    handles: "login/authenticate /login/authenticate".w(),
    needsSession: false
  });
}());
