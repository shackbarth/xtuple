/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, XM:true, XT:true, _:true */

(function () {
  "use strict";

  /**
    Returns a list of extensions associated with an organization.
   */
  exports.extensions = function (req, res) {
    var extensionCollection = new XM.ExtensionCollection(),
      fetchError = function (err) {
        X.log("Extension fetch error", err);
        res.send({isError: true, message: "Error fetching extensions"});
      },
      fetchSuccess = function (collection, result) {
        var extensions = _.map(collection.models, function (ext) {

          return {
            name: ext.get("name"),
            location: ext.get("location"),
            loadOrder: ext.get("loadOrder"),
            privilegeName: ext.get("privilegeName")
          };
        });

        res.send({data: extensions});
      };

    // Fetch the organization to get their extensions. Fetch under the authority of admin
    // or else most users would not be able to load their own extensions.
    extensionCollection.fetch({
      success: fetchSuccess,
      error: fetchError,
      username: X.options.databaseServer.user
    });
  };
}());
