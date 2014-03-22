/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true,
white:true*/
/*global enyo:true, XM:true, XV:true, XT:true, _:true */

/** @module XV */

(function () {

  //
  // USER ACCOUNT EXTENSION
  //

  /**
   * Manages the assignment of extensions to user accounts.
   *
   * @class
   * @extends XV.AssignmentBox
   */
  enyo.kind(
    /* @lends XV.UserAccountExtensionAssignmentBox */{
    name: "XV.UserAccountExtensionAssignmentBox",
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
    segments: ["Extensions"],
    translateLabels: false,
    totalCollectionName: "XM.ExtensionCollection",
    type: "extension",
    /**
     * Returns a model specific to this AssignmentBox.
     *
     * @override
     * @return {XM.UserAccountExtension}
     */
    getAssignmentModel: function (extension) {
      return new XM.UserAccountExtension({
        extension: extension
      }, {isNew: true});
    },
    /**
     * The extra spice in here is that we have to account for all of the
     * extensionss that were granted on behalf of a role. We generated that
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
        this.setIdsFromRoles([]);
        return;
      }
      var grantedRoles = roles && roles.length > 0 ? roles :
          this.getAssignedCollection().models[0].get("userAccount").get("grantedUserAccountRoles"),
        extsFromRoles = grantedRoles.map(function (model) {
          return model.getStatus() & XM.Model.DESTROYED ? [] : model.get("userAccountRole").get("grantedExtensions");
        }),
        extIdsFromRoles = _.map(extsFromRoles, function (collection) {
          return collection.map(function (model) {
            if (typeof model.extension === 'number') {
              // to be honest I'm not quite sure why this "model" variable here is sometimes a model
              // but sometimes, as in this case, a simple js object.
              return model.extension;
            }

            var extension = model.get("extension");
            if (extension) {
              return extension.id;
            } else {
              return null;
            }
          });
        }),
        uniqueIdsFromRoles = _.uniq(_.flatten(extIdsFromRoles));

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
      var id = model.get("extension") ? model.get("extension").id : model.id;
      this.undercheckCheckbox(checkbox, _.indexOf(this.getIdsFromRoles(), id) >= 0);
    }
  });

  //
  // USER ACCOUNT ROLE EXTENSION
  //

  /**
   * Manages the assignment of extensions to user accounts roles.
   *
   * @class
   * @extends XV.AssignmentBox
   */
  enyo.kind(
    /* @lends XV.UserAccountRoleExtensionAssignmentBox */{
    name: "XV.UserAccountRoleExtensionAssignmentBox",
    kind: "XV.AssignmentBox",
    segments: ["Extensions"],
    translateLabels: false,
    totalCollectionName: "XM.ExtensionCollection",
    type: "extension",
    /**
     * Returns a model specific to this AssignmentBox.
     *
     * @override
     * @return {XM.UserAccountExtension}
     */
    getAssignmentModel: function (extension) {
      return new XM.UserAccountRoleExtension({
        extension: extension
      }, {isNew: true});
    }
  });

  //
  // USER ACCOUNT ROLE
  //

  /**
   * Manages the assignment of roles to user accounts.
   *
   * @class
   * @extends XV.AssignmentBox
   */
  enyo.kind(
    /** @lends XV.UserAccountRoleAssignmentBox */{
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
      var model = new XM.UserAccountUserAccountRoleAssignment(null, {isNew: true});
      model.set("userAccountRole", roleModel);
      return model;
    }
  });

  //
  // USER ACCOUNT PRIVILEGE
  //

  /**
   * Manages the assignment of privileges to user accounts. This is a complicated case
   * because user accounts can have privileges directly assigned to them, but they can
   * also have privileges available to them on account of a role that they're assigned
   * to.
   *
   * @class
   * @extends XV.AssignmentBox
   */
  enyo.kind(
    /** @lends XV.UserAccountPrivilegeAssignmentBox */{
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
      var model = new XM.UserAccountPrivilegeAssignment(null, {isNew: true});
      model.set({
        privilege: privilegeModel
      });
      return model;
    },
    /**
      Look in XT.session.privilegeSegments to see how to group the models.
      If no match is found, return the group instead.
     */
    getModelSegment: function (name, group) {
      var returnVal;
      _.each(XT.session.privilegeSegments, function (obj, key) {
        _.each(obj, function (title) {
          if (title === name) {
            returnVal = key;
            return;
          }
        });
        if (returnVal) {
          // we've found it. No need to continue.
          return;
        }
      });
      return returnVal || group;
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
        this.setIdsFromRoles([]);
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
              return privilege.id;
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
      var id = model.get("privilege") ? model.get("privilege").id : model.id;
      this.undercheckCheckbox(checkbox, _.indexOf(this.getIdsFromRoles(), id) >= 0);
    }
  });


  //
  // USER ACCOUNT ROLE PRIVILEGE
  //

  /**
   * Manages the assignment of privileges to roles.
   *
   * @class
   * @extends XV.AssignmentBox
   */
  enyo.kind(
    /** @lends XV.UserAccountRolePrivilegeAssignmentBox */{
    name: "XV.UserAccountRolePrivilegeAssignmentBox",
    kind: "XV.AssignmentBox",
    segments: [],
    translateLabels: true,
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
     * @return {XM.UserAccountRolePrivilegeAssignment}
     */
    getAssignmentModel: function (privilegeModel) {
      return new XM.UserAccountRolePrivilegeAssignment({
        privilege: privilegeModel
      }, {isNew: true});
    },
    /**
      Look in XT.session.privilegeSegments to see how to group the models.
      If no match is found, return the group instead.
     */
    getModelSegment: function (name, group) {
      var returnVal;
      _.each(XT.session.privilegeSegments, function (obj, key) {
        _.each(obj, function (title) {
          if (title === name) {
            returnVal = key;
            return;
          }
        });
        if (returnVal) {
          // we've found it. No need to continue.
          return;
        }
      });
      return returnVal || group;
    }
  });

}());
