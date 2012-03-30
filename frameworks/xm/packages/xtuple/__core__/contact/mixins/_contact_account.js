// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.ContactAccount
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._ContactAccount = {
  /** @scope XM.ContactAccount.prototype */
  
  className: 'XM.ContactAccount',

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
    @type XM.Account
  */
  source: SC.Record.toOne('XM.Account', {
    label: '_source'.loc()
  }),

  /**
    @type XM.AccountInfo
  */
  account: SC.Record.toOne('XM.AccountInfo', {
    isNested: true,
    label: '_account'.loc()
  }),

  /**
    @type String
  */
  purpose: SC.Record.attr(String, {
    label: '_purpose'.loc()
  })

};
