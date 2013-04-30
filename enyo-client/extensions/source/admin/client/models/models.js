/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true */

(function () {
  "use strict";

  /**
    @class

    @extends XM.Document
  */
  XM.GlobalDocument = XM.Document.extend(/** @lends XM.GlobalDocument.prototype */{

    autoFetchId: false,

    documentKey: 'id',

    enforceUpperKey: false,

    databaseType: 'global',

    /**
     * The documentKey attribute must be editable for a new entry.
     */
    initialize: function (attributes, options) {
      XM.Document.prototype.initialize.apply(this, arguments);
      this.setReadOnly(this.documentKey, this.getStatus() !== XM.Model.READY_NEW);
    },

    findExisting: function (key, value, options) {
      var recordType = this.recordType || this.prototype.recordType,
        params = [ recordType, key, value, value + "1" ];
      this.dispatch('XM.Model', 'findExisting', params, options);
      return this;
    }

  });

  /**
    @class

    @extends XM.Model
  */
  XM.DatabaseServer = XM.GlobalDocument.extend(/** @lends XM.DatabaseServer.prototype */{

    recordType: 'XM.DatabaseServer',

    idAttribute: 'name',

    documentKey: 'name',

    requiredAttributes: [
      "hostname",
      "port",
      "user",
      "password"
    ]

  });

  /**
    @class

    @extends XM.Model
  */
  XM.Campaign = XM.Document.extend(/** @lends XM.Campaign.prototype */{

    recordType: 'XM.Campaign',

    databaseType: 'global',

    autoFetchId: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.CampaignRelation = XM.Info.extend(/** @lends XM.Campaign.prototype */{

    recordType: 'XM.CampaignRelation',

    editableModel: 'XM.Campaign',

    databaseType: 'global',

    autoFetchId: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.Extension = XM.Document.extend(/** @lends XM.Extension.prototype */{

    recordType: 'XM.Extension',

    enforceUpperKey: false,

    autoFetchId: true,

    databaseType: 'global',

    documentKey: 'name'

  });

  /**
    @class

    @extends XM.GlobalDocument
  */
  XM.Organization = XM.GlobalDocument.extend(/** @lends XM.Organization.prototype */{

    recordType: 'XM.Organization',

    idAttribute: 'name',

    documentKey: 'name',

    defaults: {
      isActive: true
    },

    requiredAttributes: [
      "isActive",
      "licenses",
      "group",
      "databaseServer"
    ],

    /**
      @param {Array} extensions The extensions to restrict installation to
      @param {String} template The name of the template postbooks DB to
        initialize to, or falsy if we don't want to initialize
     */
    runMaintenance: function (extensions, template) {
      var that = this,
        params = {},
        maintenanceOptions = {};

      params.organization = that.get("name");

      if (template) {
        // keep the argument out of the URL altogether if not, because
        // the maintenance route will be fooled by the truthy string "false"
        params.initialize = template;
      }

      if (extensions) {
        params.extensions = JSON.stringify(extensions);
      }

      maintenanceOptions.success = function (inResponse) {
        if (inResponse.isError) {
          XT.log("Database maintenance error", inResponse);
        } else {
          XT.log("Database maintenance successful", inResponse);
        }
      };
      XT.dataSource.runMaintenance(params, maintenanceOptions);
    }

  });

  /**
    @class

    @extends XM.Model
  */
  XM.OrganizationExtension = XM.Model.extend({
    /** @scope XM.OrganizationExtension.prototype */

    recordType: 'XM.OrganizationExtension',

    databaseType: 'global',

    autoFetchId: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.Session = XM.Model.extend({
    /** @scope XM.Session.prototype */

    recordType: 'XM.Session',

    idAttribute: 'sid',

    databaseType: 'global',

    autoFetchId: false

  });

  /**
    @class

    @extends XM.Model
  */
  XM.SessionStore = XM.Model.extend({
    /** @scope XM.SessionStore.prototype */

    recordType: 'XM.SessionStore',

    idAttribute: 'id',

    databaseType: 'global',

    autoFetchId: false

  });

  /**
    @class

    @extends XM.GlobalDocument
  */
  XM.User = XM.GlobalDocument.extend(/** @lends XM.User.prototype */{

    recordType: 'XM.User',

    nameAttribute: 'id',

    defaults: {
      isActive: true
    },

    requiredAttributes: [
      "isActive",
      "email"
    ],

    save: function (key, value, options) {
      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (_.isObject(key) || _.isEmpty(key)) {
        options = value;
      }

      options = options ? _.clone(options) : {};
      var orgs = this.get("organizations"),
        model = this,
        isNew = model.getStatus() === XM.Model.READY_NEW,
        params,
        i,
        n,
        orgOptions = {
          error: function () {
            XT.log("Error updating instance database");
          }
        },
        success = options.success;

      // Callback after each check
      options.success = function (resp) {

        // Update users on instance databases
        n = orgs.length;
        if (n && isNew) {
          orgOptions.success = function (resp) {
            n--;
            if (n <= 0) {
              model.resetPassword(true);
            }
          };

        } else if (isNew) {
          // reset the password even if there are no orgs added.
          // of course we'll have to add some if we want the
          // login to be useful.
          model.resetPassword(true);
        }

        for (i = 0; i < orgs.length; i++) {
          params = {
            user: model.id,
            organization: orgs.at(i).get("name")
          };
          XT.dataSource.syncUser(params, orgOptions);
        }
        if (success) { success(model, resp, options); }
      };

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (_.isObject(key) || _.isEmpty(key)) {
        value = options;
      }

      return XM.GlobalDocument.prototype.save.call(this, key, value, options);
    },

    resetPassword: function (newUser) {
      var that = this,
        error,
        options = {
          success: function (result) {
            var message = "An e-mail with the new password has been sent to " + that.id;
            if (result.emailSuccess) {
              that.notify(message);
            }
          },
          databaseType: "global",
          newUser: newUser || false
        };

      if (this.getStatus() === XM.Model.READY_DIRTY) {
        error = XT.Error.clone('xt1012');
        this.trigger('error', this, error, {});
        return false;
      }

      XT.dataSource.resetPassword(this.id, options);
      return this;
    }

  });

  /**
    @class

    @extends XM.Model
  */
  XM.UserOrganization = XM.Model.extend({
    /** @scope XM.UserOrganization.prototype */

    autoFetchId: true,

    recordType: 'XM.UserOrganization',

    databaseType: 'global',

    requiredAttributes: [
      "name",
      "username"
    ],

    bindEvents: function (attributes, options) {
      XM.Model.prototype.bindEvents.apply(this, arguments);
      this.on("change:user", this.userDidChange);
    },

    userDidChange: function () {
      if (this.isNew() && this.get("user") && !this.get('username')) {
        this.set("username", this.getParent().id);
      }
    }

  });

  /**
    @class

    @extends XM.Model
  */
  XM.GlobalPrivilege = XM.Model.extend(/** @lends XM.GlobalPrivilege.prototype */{

    recordType: 'XM.GlobalPrivilege',

    databaseType: 'global'

  });

  /**
    @class

    @extends XM.Model
  */
  XM.UserGlobalPrivilegeAssignment = XM.Model.extend(/** @lends XM.UserGlobalPrivilegeAssignment.prototype */{

    recordType: 'XM.UserGlobalPrivilegeAssignment',

    databaseType: 'global',

    autoFetchId: true

  });

  XM.OrganizationExtension = XM.Model.extend(/** @lends XM.OrganizationExtension.prototype */{

    recordType: 'XM.OrganizationExtension',

    databaseType: 'global',

    autoFetchId: true

  });

  // ..........................................................
  // COLLECTIONS
  //

  /**
    @class

    @extends XM.Collection
  */
  XM.DatabaseServerCollection = XM.Collection.extend({
    /** @scope XM.DatabaseServerCollection.prototype */

    model: XM.DatabaseServer

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.DatasourceCollection = XM.Collection.extend({
    /** @scope XM.DatasourceCollection.prototype */

    model: XM.DatabaseServer
  });

  /**
    @class

    @extends XM.Collection
  */
  XM.OrganizationCollection = XM.Collection.extend({
    /** @scope XM.OrganizationCollection.prototype */

    model: XM.Organization

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.SessionCollection = XM.Collection.extend({
    /** @scope XM.SessionCollection.prototype */

    model: XM.Session

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.SessionStoreCollection = XM.Collection.extend({
    /** @scope XM.SessionStoreCollection.prototype */

    model: XM.SessionStore

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.UserCollection = XM.Collection.extend({
    /** @scope XM.UserCollection.prototype */

    model: XM.User

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.UserOrganizationCollection = XM.Collection.extend({
    /** @scope XM.UserOrganizationCollection.prototype */

    model: XM.UserOrganization

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.ExtensionCollection = XM.Collection.extend(/** @lends XM.SessionCollection.prototype */{

    model: XM.Extension

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.CampaignCollection = XM.Collection.extend(/** @lends XM.CampaignCollection.prototype */{

    model: XM.Campaign

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.CampaignRelationCollection = XM.Collection.extend(/** @lends XM.CampaignRelationCollection.prototype */{

    model: XM.CampaignRelation

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.GlobalPrivilegeCollection = XM.Collection.extend(/** @lends XM.GlobalPrivilegeCollection.prototype */{

    model: XM.GlobalPrivilege

  });
}());
