/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true
white:true*/
/*global enyo:true, XM:true, XV:true, _:true */

/** @module XV */

(function () {
  /**
   * @class Manages the assignment of extensions to organizations.
   *
   * @extends XV.AssignmentBox
   */
  enyo.kind(/** @lends @OrganizationExtensionAssignmentBox# */{
    name: "XV.OrganizationExtensionAssignmentBox",
    kind: "XV.AssignmentBox",
    segments: ["Extensions"],
    translateLabels: false,
    totalCollectionName: "ExtensionCollection",
    type: "extension",
    /**
      The available privileges will be dynamically populated based on the modules
      that are loaded.
    create: function () {
      var privilegeArrays = _.map(XT.app.$.postbooks.getModules(), function (module) {
        return module.privileges ? module.privileges : [];
      });
      this.setRestrictedValues(_.uniq(_.flatten(privilegeArrays)));

      this.inherited(arguments);
    },
     */
    /**
     * Returns a model specific to this AssignmentBox.
     *
     * @override
     * @return {XM.ExtensionOrganization}
     */
    getAssignmentModel: function (extensionModel) {
      return new XM.OrganizationExtension({
        // TODO
        extension: extensionModel


        //privilege: privilegeModel,
        // XXX bad practice to use this field
        // we could get it by having the workspace inject it into us
        //userAccountRole: this.getAssignedCollection().user_account_role
      }, {isNew: true});
    }
  });

}());
