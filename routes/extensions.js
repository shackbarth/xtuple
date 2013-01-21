/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, XM:true, XT:true, _:true */

(function () {
  "use strict";

  /**
    Returns a list of extensions associated with an organization.
   */
  exports.extensions = function (req, res) {
    var organizationName = "dev", // TODO
      organization = new XM.Organization(),
      fetchError = function (err) {
        res.send(500, {isError: true, reason: "Error fetching organization"});
      },
      fetchSuccess = function (model, result) {
        console.log(result);
        var extensions = _.map(model.get("extensions").models, function (orgext) {
          var ext = orgext.get("extension");
          return {
            name: ext.get("name"),
            location: ext.get("location"),
            loadOrder: ext.get("loadOrder"),
            privilegeName: ext.get("privilegeName")
          };
        });

        // XXX temp until we get everything on the same port
        res.header("Access-Control-Allow-Origin", "*");
        res.send({data: extensions});
      };

    // Fetch the organization to get their extensions
    organization.fetch({
      id: organizationName,
      success: fetchSuccess,
      error: fetchError,
      username: X.options.globalDatabase.nodeUsername
    });
  };
}());
