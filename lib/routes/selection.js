/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

(function () {
  "use strict";

  var _fs = X.fs, _path = X.path, salt, crypt;

  /**
    Defines the selection route. Pretty sure this is for when a user selects
    their organization.

    @extends X.Route
    @class
   */
  X.selectionRoute = X.Route.create({
    handle: function (xtr) {
      var data = xtr.get("payload"),
          K = this.get("model"),
          k = new K(),
          S = this.get("sessionModel"),
          s = new S(),
          U = this.get("userModel"),
          message = "Invalid request.",
          user = new U(),
          session,
          loc,
          options = {};

      loc = "https://%@/client".f(xtr.get("request").headers.host || "localhost");

      //X.debugging = true;
      //X.debug("X.selectionRoute.handle(): ", data);

      // Validate the session cookie against the database.
      options.id = data.sid || -1;

      options.success = function (resp) {
        var dbSession = {},
            userOptions = {};

        dbSession.id = resp.get("id");
        dbSession.sid = resp.get("sid");
        dbSession.created = resp.get("created");

        // Make sure it's the same.
        if ((dbSession.id === data.id)
          && (dbSession.sid === data.sid)
          && (dbSession.created === data.created)) {
          // Now check that the passed in username and organization are valid.
          // To do this, we need to load the user from the database and get it's orgs.

          userOptions.success = function (resp) {
            var found,
                attrs = resp.toJSON();;

            // See if the cookies selected org is in the user's orgs.
            if ((found = _.find(attrs.organizations, function (o) {
              return o.name === data.selected ? true: false;
            }))) {
              // Set the session org username to the one found when loaded from the db.
              data.username = found.username;

              // Create the session.
              session = X.Session.create(data);
              session.once("isReady", function () {
                session.commit();
                xtr.write(X.mixin(session.get("details"), {loc: loc})).close();
              });
              session.on("error", function () {
                xtr.error(session.get("error"));
              });
            } else {
              xtr.error({isError: true, reason: message});
            }
          };
          userOptions.error = function (model, err) {
            xtr.error({isError: true, reason: message});
          };

          // Get the user from the db.
          userOptions.id = dbSession.id;
          userOptions.username = X.options.globalDatabase.nodeUsername;
          user.fetch(userOptions);
        }
      };
      options.error = function (model, err) {
        xtr.error({isError: true, reason: message});
      };

      // Get the session from the db.
      s.fetch(options);
    },

    model: function () {
      return X.userCache.model("User");
    }.property(),

    sessionModel: function () {
      return XM.Session;
    }.property(),

    userModel: function () {
      return XM.User;
    }.property(),

    handles: "login/selection /login/selection".w(),
    needsSession: false
  });
}());

