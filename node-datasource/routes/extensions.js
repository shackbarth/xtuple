/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, XM:true, XT:true, _:true */

(function () {
  "use strict";

  /**
    Returns a list of extensions associated with an organization.
   */
  exports.extensions = function (req, res) {
    var organizationName = req.session.passport.user.organization,
      organization = new XM.Organization(),
      fetchError = function (err) {
        res.send({isError: true, message: "Error fetching organization"});
      },
      fetchSuccess = function (model, result) {
        var extensions = _.map(model.get("extensions"), function (orgext) {
          var ext = orgext.extension,
              extDetails = {};

          extDetails = {
            name: ext.name,
            location: ext.location,
            loadOrder: ext.loadOrder,
            privilegeName: ext.privilegeName
          };
          return extDetails;
        });

        // XXX temp until we get everything on the same port
        //res.header("Access-Control-Allow-Origin", "*");
        res.send({data: extensions});
      };

    // Fetch the organization to get their extensions. Fetch under the authority of node
    // or else most users would not be able to load their own extensions.
    organization.fetch({
      id: organizationName,
      success: fetchSuccess,
      error: fetchError,
      username: X.options.globalDatabase.nodeUsername
    });
  };
}());
