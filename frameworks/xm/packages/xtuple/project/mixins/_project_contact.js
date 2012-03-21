// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.ProjectContact
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._ProjectContact = {
  /** @scope XM.ProjectContact.prototype */
  
  className: 'XM.ProjectContact',

  nestedRecordNamespace: XM,

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": true,
      "read": true,
      "update": false,
      "delete": true
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
    @type XM.Project
  */
  source: SC.Record.toOne('XM.Project', {
    label: '_source'.loc()
  }),

  /**
    @type XM.ContactInfo
  */
  contact: SC.Record.toOne('XM.ContactInfo', {
    isNested: true,
    label: '_contact'.loc()
  }),

  /**
    @type String
  */
  purpose: SC.Record.attr(String, {
    label: '_purpose'.loc()
  })

};
