/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true
white:true*/
/*global enyo:true, XM:true, XV:true, _:true */

/** @module XV */

(function () {

  /**
   * Manages the assignment of roles to user accounts.
   *
   * @class
   * @alias XV.UserAccountRoleAssignmentBox
   * @extends XV.AssignmentBox
   */
  var userAccountRoleAssignmentBox = {
    name: "XV.UserAccountRoleAssignmentBox",
    kind: "XV.AssignmentBox",
    events: {
      onRefreshPrivileges: ""
    },
    segments: ["Roles"],
    translateLabels: false,
    totalCollectionName: "XM.UserAccountRoleCollection",
    type: "userAccountRole",
    /**
     * The extra quirk handled here is that when a role is assigned to
     * a user we want to fire up an event so that the users privileges
     * can be immediately updated.
     *
     * @override
     */
    checkboxChange: function (inSender, inEvent) {
      this.inherited(arguments);
      this.doRefreshPrivileges();
      return true;
    },
    /**
     * Returns a model specific to this AssignmentBox.
     *
     * @override
     * @return {XM.UserAccountUserAccountRoleAssignment}
     */
    getAssignmentModel: function (roleModel) {
      return new XM.UserAccountUserAccountRoleAssignment({
        userAccountRole: roleModel
      }, {isNew: true});
    }
  };
  enyo.kind(userAccountRoleAssignmentBox);

  /**
   * Manages the assignment of privileges to user accounts. This is a complicated case
   * because user accounts can have privileges directly assigned to them, but they can
   * also have privileges available to them on account of a role that they're assigned
   * to.
   *
   * @class
   * @alias XV.UserAccountPrivilegeAssignmentBox
   * @extends XV.AssignmentBox
   */
  var userAccountPrivilegeAssignmentBox = {
    name: "XV.UserAccountPrivilegeAssignmentBox",
    kind: "XV.AssignmentBox",
      /**
       * Published fields
       * @type {Object}
       *
       * @property {Array} idsFromRole
       * An array of ids that the account has inherited from the role. Used
       * for the same caching
       */
    published: {
      idsFromRoles: null
    },
    cacheName: "XM.privileges",
    segments: [],
    totalCollectionName: "XM.PrivilegeCollection",
    type: "privilege",
    /**
      The available privileges will be dynamically populated based on the modules
      that are loaded.
     */
    create: function () {
      var privileges = _.map(XT.session.relevantPrivileges, function (privObj) {return privObj.privilege; });
      this.setRestrictedValues(privileges);

      this.inherited(arguments);
    },
    /**
     * Returns a model specific to this AssignmentBox.
     *
     * @override
     * @return {XM.UserAccountPrivilegeAssignment}
     */
    getAssignmentModel: function (privilegeModel) {
      return new XM.UserAccountPrivilegeAssignment({
        privilege: privilegeModel,
        userAccount: this.getAssignedCollection().userAccount
      }, {isNew: true});
    },
    /**
     * The extra spice in here is that we have to account for all of the
     * privileges that were granted on behalf of a role. We generated that
     * (published) array here, and use it later.
     *
     * @param {Array} roles If we can we get the roles from the workspace
     * instead of having to look in our own models, which may be length 0
     *
     * @override
     */
    mapIds: function (roles) {
      this.inherited(arguments);

      if ((!roles || roles.length === 0) && this.getAssignedCollection().models.length === 0) {
        // if there are no models in this collection then there are no IDs to map
        return;
      }
      var grantedRoles = roles && roles.length > 0 ? roles :
          this.getAssignedCollection().models[0].get("userAccount").get("grantedUserAccountRoles"),
        privsFromRoles = grantedRoles.map(function (model) {
          return model.getStatus() & XM.Model.DESTROYED ? [] : model.get("userAccountRole").get("grantedPrivileges");
        }),
        privIdsFromRoles = _.map(privsFromRoles, function (collection) {
          return collection.map(function (model) {
            if (typeof model.privilege === 'number') {
              // to be honest I'm not quite sure why this "model" variable here is sometimes a model
              // but sometimes, as in this case, a simple js object.
              return model.privilege;
            }

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
    /**
     * The extra piece of the override here is that we make use of the IdsFromRoles
     * array that we've already generated. If a priv is assigned not to a user
     * directly but the user has access to that priv through one of their roles, we
     * want to show the checkbox as half-checked using CSS.
     *
     * @override
     */
    setupCheckbox: function (inSender, inEvent) {
      this.inherited(arguments);

      var index = inEvent.item.indexInContainer(), //inEvent.index,
        parentSegmentRepeater = inSender.parent.parent,
        segmentIndex = parentSegmentRepeater.segmentIndex,
        model = this.getSegmentedCollections()[segmentIndex].at(index),
        checkbox = inEvent.item.$.checkbox;

      this.applyPostCheckFormatting(checkbox, model);
    },
    applyPostCheckFormatting: function (checkbox, model) {
      // we support the model coming in as the privilege itself or as the privilege assignment
      var id = model.get("privilege") ? model.get("privilege").get("id") : model.get("id");
      this.undercheckCheckbox(checkbox, _.indexOf(this.getIdsFromRoles(), id) >= 0);
    },

    // This could easily be moved into the superkind if we want to
    /**
     * Apply a half-ghosty underchecking style to the checkbox if we want to. Used here to
     * denote that a privilege is grated via a role but not directly to a user.
     */
    undercheckCheckbox: function (checkbox, isUnderchecked) {
      if (!checkbox.$.input) {
        // harmless bug: do nothing
        // TODO: check this out
      } else if (isUnderchecked && !checkbox.$.input.checked) {
        checkbox.$.input.addClass("xv-half-check");
      } else {
        checkbox.$.input.removeClass("xv-half-check");
      }
    }
  };
  enyo.kind(userAccountPrivilegeAssignmentBox);

  /**
   * Manages the assignment of privileges to roles.
   *
   * @class
   * @alias XV.UserAccountRolePrivilegeAssignmentBox
   * @extends XV.AssignmentBox
   */
  var userAccountRolePrivilegeAssignmentBox = {
    name: "XV.UserAccountRolePrivilegeAssignmentBox",
    kind: "XV.AssignmentBox",
    segments: [],
    translateLabels: false,
    totalCollectionName: "XM.PrivilegeCollection",
    type: "privilege",
    /**
      The available privileges will be dynamically populated based on the modules
      that are loaded.
     */
    create: function () {
      var privileges = _.map(XT.session.relevantPrivileges, function (privObj) {return privObj.privilege; });
      this.setRestrictedValues(privileges);

      this.inherited(arguments);
    },
    /**
     * Returns a model specific to this AssignmentBox.
     *
     * @override
     * @methodOf userAccountRolePrivilegeAssignmentBox#
     * @return {XM.UserAccountRolePrivilegeAssignment}
     */
    getAssignmentModel: function (privilegeModel) {
      return new XM.UserAccountRolePrivilegeAssignment({
        privilege: privilegeModel,
        // XXX bad practice to use this field
        // we could get it by having the workspace inject it into us
        userAccountRole: this.getAssignedCollection().user_account_role
      }, {isNew: true});
    }
  };
  enyo.kind(userAccountRolePrivilegeAssignmentBox);

}());
