/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true
white:true*/
/*global enyo:true, XM:true, XV:true, _:true */

(function () {
  /**
   * Assign roles to users
   */
  enyo.kind({
    name: "XV.UserAccountRoleWorkspaceBox",
    kind: "XV.AssignmentBox",
    events: {
      onRefreshPrivileges: ""
    },
    segments: ["Roles"],
    title: "_roles".loc(),
    translateLabels: false,
    totalCollectionName: "UserAccountRoleCollection",
    type: "userAccountRole",
    checkboxChange: function (inSender, inEvent) {
      this.inherited(arguments);
      this.doRefreshPrivileges();
      return true;
    },
    getAssignmentModel: function (roleModel) {
      return new XM.UserAccountUserAccountRoleAssignment({
        userAccountRole: roleModel,
        type: "UserAccountUserAccountRoleAssignment",
        userAccount: this.getAssignedCollection().userAccount
      }, {isNew: true});
    }
  });

  /**
   * Assign privileges to users
   */
  enyo.kind({
    name: "XV.UserAccountPrivilegeWorkspaceBox",
    kind: "XV.AssignmentBox",
    published: {
      idsFromRoles: null
    },
    cacheName: "privileges",
    segments: ["System", "CRM"], // these must follow the capitalization conventions of the privilege module
    title: "_privileges".loc(),
    totalCollectionName: "PrivilegeCollection",
    type: "privilege",
    getAssignmentModel: function (privilegeModel) {
      return new XM.UserAccountPrivilegeAssignment({
        privilege: privilegeModel,
        type: "UserAccountPrivilegeAssignment",
        userAccount: this.getAssignedCollection().userAccount
      }, {isNew: true});
    },
    mapIds: function () {
      this.inherited(arguments);

      var grantedRoles = this.getAssignedCollection().userAccount.get("grantedUserAccountRoles"),
        privsFromRoles = grantedRoles.map(function (model) {
          return model.get("userAccountRole").get("grantedPrivileges");
        }),
        privIdsFromRoles = _.map(privsFromRoles, function (collection) {
          return collection.map(function (model) {
            var privilege = model.get("privilege");
            if (privilege) {
              return privilege.get("id");
            } else {
              return null;
            }
          });
        }),
        uniqueIdsFromRoles = _.uniq(_.flatten(privIdsFromRoles));

      this.setIdsFromRoles(uniqueIdsFromRoles);
    },
    setupCheckbox: function (inSender, inEvent) {
      this.inherited(arguments);

      var index = inEvent.item.indexInContainer(), //inEvent.index,
        parentSegmentRepeater = inSender.parent.parent,
        segmentIndex = parentSegmentRepeater.segmentIndex,
        data = this.getSegmentedCollections()[segmentIndex].at(index),
        row = inEvent.item.$.checkbox;

       this.disableCheckbox(row, _.indexOf(this.getIdsFromRoles(), data.get("id")) >= 0);
    },
    // I expect this to be one day abstracted
    disableCheckbox: function (checkbox, isDisabled) {
      checkbox.setDisabled(isDisabled);
      if (isDisabled && !checkbox.$.input.value) {
        checkbox.setLabel(checkbox.getLabel() + " (Role)");
      }
    }
  });

  /**
   * Assign privileges to roles. Almost identical to the one that assigns
   * privileges to users.
   */
  enyo.kind({
    name: "XV.UserAccountRolePrivilegeWorkspaceBox",
    kind: "XV.UserAccountPrivilegeWorkspaceBox",
    getAssignmentModel: function (privilegeModel) {
      return new XM.UserAccountRolePrivilegeAssignment({
        privilege: privilegeModel,
        type: "UserAccountRolePrivilegeAssignment",
        userAccountRole: this.getAssignedCollection().user_account_role,
        // XXX why this redundancy in UserAccountRolePrivilegeAssignment?
        user_account_role: this.getAssignedCollection().user_account_role
      }, {isNew: true});
    }
  });

}());
