/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true
white:true*/
/*global enyo:true, XM:true, XV:true, _:true */

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
     * Returns a model specific to this AssignmentBox.
     *
     * @override
     * @return {XM.ExtensionOrganization}
     */
    getAssignmentModel: function (extensionModel) {
      return new XM.OrganizationExtension({
        extension: extensionModel
      }, {isNew: true});
    }
  });

  /**
   * @class Manages the assignment of global privileges to global users.
   *
   * @extends XV.AssignmentBox
   */
  enyo.kind(/** @lends @OrganizationExtensionAssignmentBox# */{
    name: "XV.UserGlobalPrivilegeAssignmentBox",
    kind: "XV.AssignmentBox",
    segments: ["Privileges"],
    translateLabels: false,
    totalCollectionName: "GlobalPrivilegeCollection",
    type: "privilege",
    /**
     * Returns a model specific to this AssignmentBox.
     *
     * @override
     * @return {XM.GlobalPrivilege}
     */
    getAssignmentModel: function (privilegeModel) {
      return new XM.UserGlobalPrivilegeAssignment({
        privilege: privilegeModel
      }, {isNew: true});
    }
  });
}());
