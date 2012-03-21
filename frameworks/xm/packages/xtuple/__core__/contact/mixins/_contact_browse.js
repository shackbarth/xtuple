// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.ContactBrowse
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._ContactBrowse = {
  /** @scope XM.ContactBrowse.prototype */
  
  className: 'XM.ContactBrowse',

  nestedRecordNamespace: XM,

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": false,
      "read": "ViewAllContacts",
      "update": false,
      "delete": false
    },
    "personal": {
      "create": false,
      "read": true,
      "update": false,
      "delete": false,
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
    @type XM.UserAccountInfo
  */
  owner: SC.Record.toOne('XM.UserAccountInfo', {
    isNested: true,
    label: '_owner'.loc()
  })

};
