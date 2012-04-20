// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.Account
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._Account = {
  /** @scope XM.Account.prototype */
  
  className: 'XM.Account',

  nestedRecordNamespace: XM,

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainAllCRMAccounts",
      "read": "ViewAllCRMAccounts",
      "update": "MaintainAllCRMAccounts",
      "delete": "MaintainAllCRMAccounts"
    },
    "personal": {
      "create": "MaintainPersonalCRMAccounts",
      "read": "ViewPersonalCRMAccounts",
      "update": "MaintainPersonalCRMAccounts",
      "delete": "MaintainPersonalCRMAccounts",
      "properties": [
        "owner"
      ]
    }
  },

  //..................................................
  // ATTRIBUTES
  //
  
  /**
    @type Number
  */
  guid: SC.Record.attr(Number),

  /**
    @type String
  */
  number: SC.Record.attr(String, {
    isRequired: true,
    label: '_number'.loc()
  }),

  /**
    @type String
  */
  name: SC.Record.attr(String, {
    isRequired: true,
    label: '_name'.loc()
  }),

  /**
    @type Boolean
  */
  isActive: SC.Record.attr(Boolean, {
    isRequired: true,
    defaultValue: true,
    label: '_isActive'.loc()
  }),

  /**
    @type String
  */
  accountType: SC.Record.attr(String, {
    isRequired: true,
    defaultValue: 'O',
    label: '_accountType'.loc()
  }),

  /**
    @type XM.AccountInfo
  */
  parent: SC.Record.toOne('XM.AccountInfo', {
    isNested: true,
    label: '_parent'.loc()
  }),

  /**
    @type String
  */
  notes: SC.Record.attr(String, {
    label: '_notes'.loc()
  }),

  /**
    @type XM.ContactInfo
  */
  primaryContact: SC.Record.toOne('XM.ContactInfo', {
    isNested: true,
    label: '_primaryContact'.loc()
  }),

  /**
    @type XM.ContactInfo
  */
  secondaryContact: SC.Record.toOne('XM.ContactInfo', {
    isNested: true,
    label: '_secondaryContact'.loc()
  }),

  /**
    @type XM.ContactInfo
  */
  contactRelations: SC.Record.toMany('XM.ContactInfo', {
    isNested: true,
    inverse: 'account',
    label: '_contactRelations'.loc()
  }),

  /**
    @type XM.UserAccountInfo
  */
  owner: SC.Record.toOne('XM.UserAccountInfo', {
    isNested: true,
    defaultValue: function() {
      var record = arguments[0],
          status = record.get('status'),
          ret;
      if (status == SC.Record.READY_NEW) {
        XM.UserAccountInfo.setCurrentUser(record, 'owner');
        ret = '_loading'.loc();
      }
    },
    label: '_owner'.loc()
  }),

  /**
    @type XM.UserAccountInfo
  */
  userAccount: SC.Record.toOne('XM.UserAccountInfo', {
    isRequired: true,
    label: '_userAccount'.loc()
  }),

  /**
    @type XM.SalesRep
  */
  salesRep: SC.Record.toOne('XM.SalesRep', {
    label: '_salesRep'.loc()
  }),

  /**
    @type XM.TaxAuthority
  */
  taxAuthority: SC.Record.toOne('XM.TaxAuthority', {
    label: '_taxAuthority'.loc()
  }),

  /**
    @type XM.AccountComment
  */
  comments: SC.Record.toMany('XM.AccountComment', {
    isNested: true,
    inverse: 'account',
    label: '_comments'.loc()
  }),

  /**
    @type XM.AccountCharacteristic
  */
  characteristics: SC.Record.toMany('XM.AccountCharacteristic', {
    isNested: true,
    inverse: 'account',
    label: '_characteristics'.loc()
  }),

  /**
    @type XM.AccountContact
  */
  contacts: SC.Record.toMany('XM.AccountContact', {
    isNested: true,
    inverse: 'source',
    label: '_contacts'.loc()
  }),

  /**
    @type XM.AccountItem
  */
  items: SC.Record.toMany('XM.AccountItem', {
    isNested: true,
    inverse: 'source',
    label: '_items'.loc()
  }),

  /**
    @type XM.AccountFile
  */
  files: SC.Record.toMany('XM.AccountFile', {
    isNested: true,
    inverse: 'source',
    label: '_files'.loc()
  }),

  /**
    @type XM.AccountImage
  */
  images: SC.Record.toMany('XM.AccountImage', {
    isNested: true,
    inverse: 'source',
    label: '_images'.loc()
  }),

  /**
    @type XM.AccountUrl
  */
  urls: SC.Record.toMany('XM.AccountUrl', {
    isNested: true,
    inverse: 'source',
    label: '_urls'.loc()
  }),

  /**
    @type XM.AccountAccount
  */
  accounts: SC.Record.toMany('XM.AccountAccount', {
    isNested: true,
    inverse: 'source',
    label: '_accounts'.loc()
  })

};
