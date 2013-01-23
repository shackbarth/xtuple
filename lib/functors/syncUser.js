/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, XM:true, XT:true */

(function () {
  "use strict";

  /**
    Synce instance user account to information we have in the `XM.User` record.
    This will create a Postgres user and User Account if required, otherwise
    updates the user account.

    @extends X.Route
    @class
   */
  X.Functor.create({

    handle: function (xtr, session) {
      var params = xtr.get("payload").payload,
        attrs,
        options = {},
        user = new XM.User({id: params.username}),
        org = new XM.Organization({id: params.name}),
        K = XM.Model,
        fetchOptions = {};
        
      fetchOptions.success = function () {
        var userOrg = user.get('organizations').where({name: params.name})[0];
        if (user.getStatus() === K.READY_CLEAN &&
             org.getStatus() === K.READY_CLEAN) {
          
          // The values we will set the user account record to
          attrs = {
            username: userOrg.get("username"),
            group: org.get("group"), // Database role
            active: user.get("isActive"),
            propername: user.get("properName"),
            email: user.get("email")
          };
          
          // Connection to get to this instance
          options.conn = {
            hostname: org.getValue("databaseServer.hostname"),
            port: org.getValue("databaseServer.port"),
            database: org.get("name"),
            user: org.getValue("databaseServer.user"),
            password: org.getValue("databaseServer.password")
          };
          
          XT.dataSource.dispatch('XM.User', 'sync', attrs, options);
        }
      };
      
    },

    handles: "function/syncUser",

    needsSession: true
  });
}());


