/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, XM:true */

(function () {
  "use strict";

  var _fs = X.fs, _path = X.path, salt, crypt;

  // TODO: THIS HAS TO CHANGE FOR RELEASE THIS MUST BE GLOBALLY AVAILABLE
  // TO ALL DATASOURCES [ed. note: plural of datasource is datasources]
  // TODO We can delete the salt all together once we're all using bcrypt.
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
        message = "Unknown user or invalid password match.",
        attrs,
        that = this;

      //X.debugging = true;
      //X.debug(data);
      if (!data) {
        xtr.error({isError: true, reason: "Invalid request."});
        return;
      }

      // For Mobile Safari issue#18707
      delete data.timeStamp;

      if (!data || !data.password) {
        xtr.error({isError: true, reason: "Please enter a username and password."});
      } else {
        data.md5pass = crypt(data.password);
        data.bcryptpass = X.bcrypt.hashSync(data.password, 10);

        options.success = function () {
          // Check if old MD5 or new bcrypt matches stored hash.
          if ((user.get('password') !== data.md5pass) && (!X.bcrypt.compareSync(data.password, user.get('password')))) {
            xtr.error({isError: true, reason: message});
          } else if (!user.get('isActive')) {
            // You shouldn't confirm a user exists during invalid logins.
            // It goes against security best practices.
            //message = "User is disabled";
            xtr.error({isError: true, reason: message});
          } else {
            attrs = user.toJSON();
            delete attrs.password;

            session = X.Session.create(attrs);
            session.once("isReady", function () {
              // Commit the session to the db here, not in an inti function.
              session.commit();
              // Check for old MD5 hash method.
              if (user.get('password') === data.md5pass) {
                // Still using an MD5 hash, update it.
                that.recryptPassword(xtr, session, data);
              } else {
                xtr.write(session.get("details")).close();
              }
            });
          }
        };
        options.error = function (err) {
          xtr.error({isError: true, reason: message});
        };
        options.id = data.id;
        options.username = X.options.globalDatabase.nodeUsername;
        user.fetch(options);
      }
    },

    // TODO This can go away once we're converted everyone to bcrypt hashes.
    /**
    Switches a user's password hash from MD5 to bcrypt after they have logged in.

    @param {X.Reponse} xtr
    @param {X.Session} session
    @param {login payload data with bcrypt password} data
   */
    recryptPassword: function (xtr, session, data) {
      var K = this.get("model"),
          options = {},
          saveOptions = {},
          user = new K();

      options.success = function (res) {
        // Update the user's password with a bcrypt value.
        user.set({password: data.bcryptpass});
        user.save(null, saveOptions);
      };
      options.error = function (model, err) {
// TODO Not sure how best to handle an error here. But this should go away soon.
        X.debug("recryptPassword fetch user error: ", err);
        xtr.error({isError: true, reason: "You broke it."});
      };

      saveOptions.success = function (res) {
        xtr.write(session.get("details")).close();
      };
      saveOptions.error = function (model, err) {
// TODO Not sure how best to handle an error here. But this should go away soon.
        X.debug("recryptPassword save user error: ", err);
        xtr.error({isError: true, reason: "You broke it."});
      };

      options.id = data.id;
      options.password = data.md5pass;
      options.username = X.options.globalDatabase.nodeUsername;
      saveOptions.username = X.options.globalDatabase.nodeUsername;

      // Reload the user so we have access privs.
      user.fetch(options);
    },

    model: function () {
      return XM.User;
    }.property(),
    handles: "login/authenticate /login/authenticate".w(),
    needsSession: false
  });
}());
