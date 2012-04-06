// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.Contact
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._Contact = {
  /** @scope XM.Contact.prototype */
  
  className: 'XM.Contact',

  nestedRecordNamespace: XM,

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainAllContacts",
      "read": "ViewAllContacts",
      "update": "MaintainAllContacts",
      "delete": "MaintainAllContacts"
    },
    "personal": {
      "create": "MaintainPersonalContacts",
      "read": "ViewPersonalContacts",
      "update": "MaintainPersonalContacts",
      "delete": "MaintainPersonalContacts",
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
    label: '_number'.loc()
  }),

  /**
    @type Boolean
  */
  isActive: SC.Record.attr(Boolean, {
    label: '_isActive'.loc()
  }),

  /**
    @type String
  */
  honorific: SC.Record.attr(String, {
    label: '_honorific'.loc()
  }),

  /**
    @type String
  */
  firstName: SC.Record.attr(String, {
    label: '_firstName'.loc()
  }),

  /**
    @type String
  */
  middleName: SC.Record.attr(String, {
    label: '_middleName'.loc()
  }),

  /**
    @type String
  */
  lastName: SC.Record.attr(String, {
    label: '_lastName'.loc()
  }),

  /**
    @type String
  */
  suffix: SC.Record.attr(String, {
    label: '_suffix'.loc()
  }),

  /**
    @type String
  */
  jobTitle: SC.Record.attr(String, {
    label: '_jobTitle'.loc()
  }),

  /**
    @type String
  */
  initials: SC.Record.attr(String, {
    label: '_initials'.loc()
  }),

  /**
    @type String
  */
  phone: SC.Record.attr(String, {
    label: '_phone'.loc()
  }),

  /**
    @type String
  */
  alternate: SC.Record.attr(String, {
    label: '_alternate'.loc()
  }),

  /**
    @type String
  */
  fax: SC.Record.attr(String, {
    label: '_fax'.loc()
  }),

  /**
    @type String
  */
  primaryEmail: SC.Record.attr(String, {
    label: '_primaryEmail'.loc()
  }),

  /**
    @type String
  */
  webAddress: SC.Record.attr(String, {
    label: '_webAddress'.loc()
  }),

  /**
    @type XM.AccountInfo
  */
  account: SC.Record.toOne('XM.AccountInfo', {
    isNested: true,
    label: '_account'.loc()
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
      if (status = SC.Record.READY_NEW) {
        XM.UserAccountInfo.setCurrentUser(record, 'owner');
        ret = '_loading'.loc();
      }
    },
    label: '_owner'.loc()
  }),

  /**
    @type String
  */
  notes: SC.Record.attr(String, {
    label: '_notes'.loc()
  }),

  /**
    @type XM.AddressInfo
  */
  address: SC.Record.toOne('XM.AddressInfo', {
    isNested: true,
    label: '_address'.loc()
  }),

  /**
    @type XM.ContactEmail
  */
  email: SC.Record.toMany('XM.ContactEmail', {
    isNested: true,
    inverse: 'contact',
    label: '_email'.loc()
  }),

  /**
    @type XM.ContactComment
  */
  comments: SC.Record.toMany('XM.ContactComment', {
    isNested: true,
    inverse: 'contact',
    label: '_comments'.loc()
  }),

  /**
    @type XM.ContactCharacteristic
  */
  characteristics: SC.Record.toMany('XM.ContactCharacteristic', {
    isNested: true,
    inverse: 'contact',
    label: '_characteristics'.loc()
  }),

  /**
    @type XM.ContactAccount
  */
  accounts: SC.Record.toMany('XM.ContactAccount', {
    isNested: true,
    inverse: 'source',
    label: '_accounts'.loc()
  }),

  /**
    @type XM.ContactContact
  */
  contacts: SC.Record.toMany('XM.ContactContact', {
    isNested: true,
    inverse: 'source',
    label: '_contacts'.loc()
  }),

  /**
    @type XM.ContactItem
  */
  items: SC.Record.toMany('XM.ContactItem', {
    isNested: true,
    inverse: 'source',
    label: '_items'.loc()
  }),

  /**
    @type XM.ContactFile
  */
  files: SC.Record.toMany('XM.ContactFile', {
    isNested: true,
    inverse: 'source',
    label: '_files'.loc()
  }),

  /**
    @type XM.ContactImage
  */
  images: SC.Record.toMany('XM.ContactImage', {
    isNested: true,
    inverse: 'source',
    label: '_images'.loc()
  }),

  /**
    @type XM.ContactUrl
  */
  urls: SC.Record.toMany('XM.ContactUrl', {
    isNested: true,
    inverse: 'source',
    label: '_urls'.loc()
  })

};
