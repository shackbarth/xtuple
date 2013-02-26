/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, XM:true, XT:true */

(function () {
  "use strict";

  /**
    Synce instance user account to information we have in the `XM.User` record.
    This will create a Postgres user and User Account if required, otherwise
    updates the user account.
   */
  exports.syncUser = function (req, res) {
    var args = req.query,
      attrs,
      user = XM.User.findOrCreate(args.user) ||
        new XM.User({ id: args.user }),
      org = XM.Organization.findOrCreate(args.organization) ||
        new XM.Organization({ name: args.organization }),
      userOrg,
      K = XM.Model,
      fetchOptions = {},
      wasError = false,
      query;

    fetchOptions.success = function () {
      if (user.getStatus() === K.READY_CLEAN &&
           org.getStatus() === K.READY_CLEAN) {
        userOrg = user.get('organizations').where({name: args.organization})[0];

        // The values we will set the user account record to
        attrs = {
          username: userOrg.get("username"),
          group: org.get("group"), // Database role
          active: user.get("isActive"),
          propername: user.get("properName"),
          email: user.get("email")
        };

        query = "select xt.user_account_sync($$%@$$)".f(JSON.stringify(attrs));

        X.debug("syncUser(): %@".f(query));

        X.database.query(org.get("name"), query, function (err, result) {
          if (err) {
            res.send({isError: true, message: err});
          } else {
            res.send({data: result});
          }
        });
      }
    };

    fetchOptions.error = function (error) {
      if (!wasError) { // only error out once
        wasError = true;
        res.send({isError: true, message: "Error synching user"});
      }
    }

    // if the requesting user doesn't have ViewGlobalUsers or ViewOrganizations
    // privileges, then the fetch will come back empty, which is what we want
    fetchOptions.username = req.session.passport.user.id;

    // Go get 'em
    user.fetch(fetchOptions);
    org.fetch(fetchOptions);
  };
}());


