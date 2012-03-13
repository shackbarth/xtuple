// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.Contact
  @class

  This code is automatically generated and will be over-written. Do not edit directly.

  @extends XM.Record
*/
XM._Contact = XM.Record.extend(
  /** @scope XM.Contact.prototype */ {
  
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
  number: SC.Record.attr(String),

  /**
    @type Boolean
  */
  isActive: SC.Record.attr(Boolean),

  /**
    @type String
  */
  honorific: SC.Record.attr(String),

  /**
    @type String
  */
  firstName: SC.Record.attr(String),

  /**
    @type String
  */
  middleName: SC.Record.attr(String),

  /**
    @type String
  */
  lastName: SC.Record.attr(String),

  /**
    @type String
  */
  suffix: SC.Record.attr(String),

  /**
    @type String
  */
  jobTitle: SC.Record.attr(String),

  /**
    @type String
  */
  initials: SC.Record.attr(String),

  /**
    @type String
  */
  phone: SC.Record.attr(String),

  /**
    @type String
  */
  alternate: SC.Record.attr(String),

  /**
    @type String
  */
  fax: SC.Record.attr(String),

  /**
    @type String
  */
  primaryEmail: SC.Record.attr(String),

  /**
    @type String
  */
  webAddress: SC.Record.attr(String),

  /**
    @type XM.UserAccountInfo
  */
  owner: SC.Record.toOne('XM.UserAccountInfo', {
    isNested: true
  }),

  /**
    @type String
  */
  notes: SC.Record.attr(String),

  /**
    @type XM.AddressInfo
  */
  address: SC.Record.toOne('XM.AddressInfo', {
    isNested: true
  }),

  /**
    @type XM.ContactEmail
  */
  email: SC.Record.toMany('XM.ContactEmail', {
    isNested: true,
    inverse: 'contact'
  }),

  /**
    @type XM.ContactComment
  */
  comments: SC.Record.toMany('XM.ContactComment', {
    isNested: true,
    inverse: 'contact'
  }),

  /**
    @type XM.ContactCharacteristic
  */
  characteristics: SC.Record.toMany('XM.ContactCharacteristic', {
    isNested: true,
    inverse: 'contact'
  }),

  /**
    @type XM.ContactContact
  */
  contacts: SC.Record.toMany('XM.ContactContact', {
    isNested: true,
    inverse: 'source'
  }),

  /**
    @type XM.ContactItem
  */
  items: SC.Record.toMany('XM.ContactItem', {
    isNested: true,
    inverse: 'source'
  }),

  /**
    @type XM.ContactFile
  */
  files: SC.Record.toMany('XM.ContactFile', {
    isNested: true,
    inverse: 'source'
  }),

  /**
    @type XM.ContactImage
  */
  images: SC.Record.toMany('XM.ContactImage', {
    isNested: true,
    inverse: 'source'
  }),

  /**
    @type XM.ContactUrl
  */
  urls: SC.Record.toMany('XM.ContactUrl', {
    isNested: true,
    inverse: 'source'
  })

});
