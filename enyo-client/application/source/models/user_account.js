/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true, white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  /**
    @class

    @extends XM.Document
  */
  XM.Language = XM.Document.extend({
    /** @scope XM.Language.prototype */

    recordType: 'XM.Language',

    documentKey: 'name',

    enforceUpperKey: false,

    readOnly: true

  });

  /**
    @class

    @extends XM.Document
  */
  XM.Locale = XM.Document.extend({
    /** @scope XM.Locale.prototype */

    recordType: 'XM.Locale',

    documentKey: 'code',

    enforceUpperKey: false,

    defaults: {
      altEmphasisColor: "",
      costScale: 2,
      currencyScale: 2,
      description: "",
      emphasisColor: "",
      errorColor: "",
      expiredColor: "",
      extendedPriceScale: 2,
      futureColor: "",
      percentScale: 2,
      purchasePriceScale: 4,
      quantityPerScale: 6,
      quantityScale: 2,
      salesPriceScale: 4,
      unitRatioScale: 6,
      warningColor: "",
      weightScale: 2
    }

  });

  /**
    @class

    @extends XM.Model
  */
  XM.Extension = XM.Model.extend(/** @lends XM.Extension.prototype */{

    recordType: 'XM.Extension'

  });

  /**
    @class

    @extends XM.Model
  */
  XM.UserAccountExtension = XM.Model.extend(/** @lends XM.UserAccountExtension.prototype */{

    recordType: 'XM.UserAccountExtension'

  });

  /**
    @class

    @extends XM.Model
  */
  XM.Privilege = XM.Model.extend({
    /** @scope XM.Privilege.prototype */

    recordType: 'XM.Privilege',

    readOnly: true

  });

  /**
    @class

    @extends XM.Document
  */
  XM.UserAccountRole = XM.Document.extend({
    /** @scope XM.UserAccountRole.prototype */

    recordType: 'XM.UserAccountRole',

    documentKey: 'name'

  });

  /**
    @class

    @extends XM.Info
  */
  XM.UserAccountRoleRelation = XM.Info.extend({
    /** @scope XM.UserAccountRoleRelation.prototype */

    recordType: 'XM.UserAccountRoleRelation',

    editableModel: 'XM.UserAccountRole'

  });

  /**
    @class

    @extends XM.Model
  */
  XM.UserAccountRolePrivilegeAssignment = XM.Model.extend({
    /** @scope XM.UserAccountRolePrivilegeAssignment.prototype */

    recordType: 'XM.UserAccountRolePrivilegeAssignment'

  });

  /**
    @class

    @extends XM.Model
  */
  XM.UserAccountRoleExtension = XM.Model.extend(/** @lends XM.UserAccountRoleExtension.prototype */{

    recordType: 'XM.UserAccountRoleExtension'

  });

  /**
    @class

    @extends XM.Document
  */
  XM.UserAccount = XM.AccountDocument.extend({
    /** @scope XM.UserAccount.prototype */

    idAttribute: 'username',

    nameAttribute: "properName",

    recordType: 'XM.UserAccount',

    documentKey: 'username',

    enforceUpperKey: false,

    autoFetchId: false,

    defaults: {
      disableExport: false,
      isActive: true
    },

    bindEvents: function () {
      XM.Document.prototype.bindEvents.apply(this, arguments);
      this.on('statusChange', this.statusChanged);
      this.on('change:username', this.usernameChanged);
      this.statusChanged();
    },

    documentKeyDidChange: function (model, value, options) {
      var that = this,
        lower = this.get("username").toLowerCase();
      options = options || {};

      if (value !== lower) {
        this.set("username", lower, options);
        return;
      }

      // Check for conflicts
      if (this.checkConflicts && value && this.isDirty() && !this._number) {
        options.success = function (resp) {
          var err, params = {};
          if (resp) {
            params.attr = ("_" + that.documentKey).loc();
            params.value = value;
            err = XT.Error.clone('xt1008', { params: params });
            that.trigger('error', that, err, options);
          }
        };
        this.findExisting("number", value, options);
      }
    },

    findExisting: function (key, value, options) {
      XM.Account.findExisting("number", value.toUpperCase(), options);
    },

    usernameChanged: function () {
      var username = this.get('username');
      if (username) {
        this.set('username', username.toLowerCase());
      }
    },

    // two-step: change the password if necessary
    save: function (key, value, options) {
      var that = this,
        success,
        password = this.get("password"),
        isNew = this.isNew();

      if (!password) {
        return XM.Document.prototype.save.call(this, key, value, options);
      }

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (_.isObject(key) || _.isEmpty(key)) {
        options = value;
      }
      options = options ? _.clone(options) : {};

      success = options.success;
      options.success = function (model, resp, options) {
        var resetOptions = {
          isNew: isNew,
          newPassword: password
        };

        XT.dataSource.resetPassword(model.id, resetOptions);
        if (success) { success(model, resp, options); }
      };


      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (_.isObject(key) || _.isEmpty(key)) {
        value = options;
      }

      XM.Document.prototype.save.call(this, key, value, options);

    },

    /**
     * The username attribute must be editable for a new entry. This overrides
     * the fact that model sets username as readOnly by virtue of its being
     * the idAttribute. Most other idAttributes are autogenerated.
     */
    statusChanged: function () {
      this.setReadOnly('username', this.getStatus() !== XM.Model.READY_NEW);
    },

    validate: function (attributes, options) {
      var isNew = this.isNew();

      if ((this.get("password") || this._passwordCheck) &&
          this.get("password") !== this._passwordCheck) {
        // password mismatch
        return XT.Error.clone('xt2016');

      } else if (!this.get("password") && isNew) {
        // new user accounts need to have a password set
        return XT.Error.clone('xt1004', { params: {attr: "_password".loc()} });

      } else if (!this.get("password") && this.get("useEnhancedAuth") !== this._cache.useEnhancedAuth) {
        // if they toggle enhanced auth, then they need to set a new password
        return XT.Error.clone('xt1004', { params: {attr: "_password".loc()} });

      }

      // clear out passwordCheck, so as not to upset the model validation
      delete this.attributes.passwordCheck;
      delete attributes.passwordCheck;

      return XM.Model.prototype.validate.call(this, attributes, options);
    }

  });

  /**
    @class

    @extends XM.Model
  */
  XM.UserAccountPrivilegeAssignment = XM.Model.extend({
    /** @scope XM.UserAccountPrivilegeAssignment.prototype */

    recordType: 'XM.UserAccountPrivilegeAssignment'

  });

  /**
    @class

    @extends XM.Model
  */
  XM.UserAccountUserAccountRoleAssignment = XM.Model.extend({
    /** @scope XM.UserAccountUserAccountRoleAssignment.prototype */

    recordType: 'XM.UserAccountUserAccountRoleAssignment'

  });

  /**
    @class

    @extends XM.Info
  */
  XM.UserAccountRelation = XM.Info.extend({
    /** @scope XM.UserAccountRelation.prototype */

    idAttribute: 'username',

    recordType: 'XM.UserAccountRelation',

    editableModel: 'XM.UserAccount'

  });

  // ..........................................................
  // COLLECTIONS
  //

  /**
   @class

   @extends XM.Collection
  */
  XM.LanguageCollection = XM.Collection.extend({
   /** @scope XM.LanguageCollection.prototype */

    model: XM.Language

  });

  /**
   @class

   @extends XM.Collection
  */
  XM.LocaleCollection = XM.Collection.extend({
   /** @scope XM.LocaleCollection.prototype */

    model: XM.Locale

  });

  /**
   @class

   @extends XM.Collection
  */
  XM.ExtensionCollection = XM.Collection.extend(/** @lends XM.ExtensionCollection.prototype */{

    model: XM.Extension

  });

  /**
   @class

   @extends XM.Collection
  */
  XM.UserAccountExtensionCollection = XM.Collection.extend(/** @lends XM.UserAccountExtensionCollection.prototype */{

    model: XM.UserAccountExtension

  });

  /**
   @class

   @extends XM.Collection
  */
  XM.PrivilegeCollection = XM.Collection.extend({
   /** @scope XM.PrivilegeCollection.prototype */

    model: XM.Privilege

  });

  /**
   @class

   @extends XM.Collection
  */
  XM.UserAccountRoleCollection = XM.Collection.extend({
   /** @scope XM.UserAccountRoleCollection.prototype */

    model: XM.UserAccountRole

  });

  /**
   @class

   @extends XM.Collection
  */
  XM.UserAccountRoleRelationCollection = XM.Collection.extend({
   /** @scope XM.UserAccountRoleRelationCollection.prototype */

    model: XM.UserAccountRoleRelation

  });

  /**
   @class

   @extends XM.Collection
  */
  XM.UserAccountRoleExtensionCollection = XM.Collection.extend(/** @lends XM.UserAccountRoleExtensionCollection.prototype */{

    model: XM.UserAccountRoleExtension

  });

  /**
   @class

   @extends XM.Collection
  */
  XM.UserAccountRelationCollection = XM.Collection.extend({
   /** @scope XM.UserAccountRelationCollection.prototype */

    model: XM.UserAccountRelation

  });

}());
