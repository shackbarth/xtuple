/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, XM:true */

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
      var data = xtr.get("payload"),
        K = this.get('model'),
        user = new K(),
        options = {},
        session,
        message = "Unknown user or invalid password match",
        attrs;

      //X.debugging = true;
      //X.debug(data);
      // For Mobile Safari issue#18707
      delete data.timeStamp;
      
      if (!data || !data.password) {
        xtr.error({isError: true, reason: "invalid password"});
      } else {
        data.password = crypt(data.password);
        options.success = function () {
          if (user.get('password') !== data.password) {
            xtr.error({isError: true, reason: message});
          } else {
            attrs = user.toJSON();
            delete attrs.password;
            session = X.Session.create(attrs);
            session.once("isReady", function () {
              xtr.write(session.get("details")).close();
            });
          }
        };
        options.error = function (err) {
          xtr.error({isError: true, reason: message});
        };
        options.id = data.id;
        user.fetch(options);
      }
    },
    model: function () {
      return XM.User;
    }.property(),
    handles: "login/authenticate /login/authenticate".w(),
    needsSession: false
  });
}());
