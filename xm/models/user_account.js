/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true, 
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
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

    privileges: {
      "all": {
        "create": "MaintainLocales",
        "read": true,
        "update": "MaintainLocales",
        "delete": "MaintainLocales"
      }
    },

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
    },

    requiredAttributes: [
      "altEmphasisColor",
      "costScale",
      "currencyScale",
      "description",
      "emphasisColor",
      "errorColor",
      "expiredColor",
      "extendedPriceScale",
      "futureColor",
      "percentScale",
      "purchasePriceScale",
      "quantityPerScale",
      "quantityScale",
      "salesPriceScale",
      "unitRatioScale",
      "warningColor",
      "weightScale"
    ],

    relations: [{
      type: Backbone.HasOne,
      key: 'language',
      relatedModel: 'XM.Language',
      includeInJSON: 'guid'
    }]

  });

  /**
    @class

    @extends XT.Model
  */
  XM.Privilege = XT.Model.extend({
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

    documentKey: 'name',

    privileges: {
      "all": {
        "create": "MaintainGroups",
        "read": "MaintainGroups",
        "update": "MaintainGroups",
        "delete": "MaintainGroups"
      }
    },

    relations: [{
      type: Backbone.HasMany,
      key: 'grantedPrivileges',
      relatedModel: 'XM.UserAccountRolePrivilegeAssignment',
      reverseRelation: {
        key: 'userAccountRole'
      }
    }]

  });

  /**
    @class

    @extends XT.Model
  */
  XM.UserAccountRoleInfo = XT.Model.extend({
    /** @scope XM.UserAccountRoleInfo.prototype */

    recordType: 'UserAccountRole',

    readOnly: true,

    relations: [{
      type: Backbone.HasMany,
      key: 'grantedPrivileges',
      relatedModel: 'XM.UserAccountRolePrivilegeAssignment',
      reverseRelation: {
        key: 'userAccountRole'
      }
    }]

  });

  /**
    @class

    @extends XT.Model
  */
  XM.UserAccountRolePrivilegeAssignment = XM.Document.extend({
    /** @scope XM.UserAccountRolePrivilegeAssignment.prototype */

    recordType: 'UserAccountRolePrivilegeAssignment',

    relations: [{
      type: Backbone.HasOne,
      key: 'privilege',
      relatedModel: 'XM.Privilege',
      includeInJSON: 'guid'
    }]

  });

  /**
    @class

    @extends XM.AccountDocument
  */
  XM.UserAccount = XM.AccountDocument.extend({
    /** @scope XM.UserAccount.prototype */

    idAttribute: 'username',

    recordType: 'XM.UserAccount',

    documentKey: 'username',

    enforceUpperKey: false,

    privileges: {
      "all": {
        "create": "MaintainUsers",
        "read": "MaintainUsers",
        "update": "MaintainUsers",
        "delete": false
      }
    },

    defaults: {
      canCreateUsers: false,
      disableExport: false,
      isDatabaseUser: false
    },

    requiredAttributes: [
      "canCreateUsers",
      "disableExport",
      "isDatabaseUser"
    ],

    relations: [{
      type: Backbone.HasOne,
      key: 'locale',
      relatedModel: 'XM.Locale',
      includeInJSON: 'guid'
    }, {
      type: Backbone.HasMany,
      key: 'grantedPrivileges',
      relatedModel: 'XM.UserAccountPrivilegeAssignment',
      reverseRelation: {
        key: 'userAccount'
      }
    }, {
      type: Backbone.HasMany,
      key: 'userAccountRoles',
      relatedModel: 'XM.UserAccountRole',
      reverseRelation: {
        key: 'userAccount'
      }
    }, {
      type: Backbone.HasMany,
      key: 'grantedUserAccountRoles',
      relatedModel: 'XM.UserAccountUserAccountRoleAssignment',
      reverseRelation: {
        key: 'userAccount'
      }
    }]

  });

  /**
    @class

    @extends XT.Model
  */
  XM.UserAccountPrivilegeAssignment = XT.Model.extend({
    /** @scope XM.UserAccountPrivilegeAssignment.prototype */

    recordType: 'XM.UserAccountPrivilegeAssignment',

    privileges: {
      "all": {
        "create": true,
        "read": true,
        "update": false,
        "delete": true
      }
    },

    requiredAttributes: [
      "userAccount",
      "privilege"
    ],

    relations: [{
      type: Backbone.HasOne,
      key: 'privilege',
      relatedModel: 'XM.Privilege',
      includeInJSON: 'guid'
    }]

  });

  /**
    @class

    @extends XT.Model
  */
  XM.UserAccountUserAccountRoleAssignment = XM.Document.extend({
    /** @scope XM.UserAccountUserAccountRoleAssignment.prototype */

    recordType: 'UserAccountUserAccountRoleAssignment',

    relations: [{
      type: Backbone.HasOne,
      key: 'userAccountRole',
      relatedModel: 'XM.UserAccountRoleInfo',
      includeInJSON: 'guid'
    }]

  });

  /**
    @class
  
    @extends XT.Model
  */
  XM.UserAccountInfo = XT.Model.extend({
    /** @scope XM.UserAccountInfo.prototype */

    idAttribute: 'username',

    recordType: 'XM.UserAccountInfo',

    readOnly: true

  });

  // ..........................................................
  // COLLECTIONS
  //

  /**
   @class

   @extends XT.Collection
  */
  XM.LanguageCollection = XT.Collection.extend({
   /** @scope XM.LanguageCollection.prototype */

    model: XM.Language

  });

  /**
   @class

   @extends XT.Collection
  */
  XM.LocaleCollection = XT.Collection.extend({
   /** @scope XM.LocaleCollection.prototype */

    model: XM.Locale

  });

  /**
   @class

   @extends XT.Collection
  */
  XM.PrivilegeCollection = XT.Collection.extend({
   /** @scope XM.PrivilegeCollection.prototype */

    model: XM.Privilege

  });

  /**
   @class

   @extends XT.Collection
  */
  XM.UserAccountInfoCollection = XT.Collection.extend({
   /** @scope XM.UserAccountInfoCollection.prototype */

    model: XM.UserAccountInfo

  });

}());
