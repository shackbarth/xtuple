/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, XM:true, XT:true */

(function () {
  "use strict";

  /**
    Returns a list of extensions associated with an organization.

    @extends X.Route
    @class
   */
  X.Functor.create({
    handle: function (xtr, session, callback) {
      var that = this,
        organizationName = session.get("details").organization,
        organization = new XM.Organization(),
        fetchError = function (err) {
          xtr.error({isError: true, reason: "Error fetching organization"});
        },
        fetchSuccess = function (model, result) {
          var extensions = _.map(model.get("extensions"), function (ext) {
            return {
              location: ext.extension.location,
              privilegeName: ext.extension.privilegeName
            };
          });

          xtr.write({data: extensions}).close();
        };

      // Fetch the organization to get their extensions
      organization.fetch({id: organizationName, success: fetchSuccess, error: fetchError});

    },
    handles: "function/extensions",
    needsSession: true
  });
}());
