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
    ]

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

    @extends XM.Model
  */
  XM.UserAccountRoleInfo = XM.Model.extend({
    /** @scope XM.UserAccountRoleInfo.prototype */

    recordType: 'XM.UserAccountRole',

    readOnly: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.UserAccountRolePrivilegeAssignment = XM.Document.extend({
    /** @scope XM.UserAccountRolePrivilegeAssignment.prototype */

    recordType: 'XM.UserAccountRolePrivilegeAssignment'

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

    defaults: {
      disableExport: false,
      isDatabaseUser: false
    },

    requiredAttributes: [
      "disableExport",
      "isDatabaseUser"
    ]

  });

  /**
    @class

    @extends XM.Model
  */
  XM.UserAccountPrivilegeAssignment = XM.Model.extend({
    /** @scope XM.UserAccountPrivilegeAssignment.prototype */

    recordType: 'XM.UserAccountPrivilegeAssignment',

    requiredAttributes: [
      "userAccount",
      "privilege"
    ]

  });

  /**
    @class

    @extends XM.Model
  */
  XM.UserAccountUserAccountRoleAssignment = XM.Document.extend({
    /** @scope XM.UserAccountUserAccountRoleAssignment.prototype */

    recordType: 'XM.UserAccountUserAccountRoleAssignment'

  });

  /**
    @class

    @extends XM.Model
  */
  XM.UserAccountInfo = XM.Model.extend({
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
  XM.PrivilegeCollection = XM.Collection.extend({
   /** @scope XM.PrivilegeCollection.prototype */

    model: XM.Privilege

  });

  /**
   @class

   @extends XM.Collection
  */
  XM.UserAccountRoleInfoCollection = XM.Collection.extend({
   /** @scope XM.UserAccountRoleInfoCollection.prototype */

    model: XM.UserAccountRoleInfo

  });

  /**
   @class

   @extends XM.Collection
  */
  XM.UserAccountInfoCollection = XM.Collection.extend({
   /** @scope XM.UserAccountInfoCollection.prototype */

    model: XM.UserAccountInfo

  });

}());
