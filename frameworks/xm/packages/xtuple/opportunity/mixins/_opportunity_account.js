// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.OpportunityAccount
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._OpportunityAccount = {
  /** @scope XM.OpportunityAccount.prototype */
  
  className: 'XM.OpportunityAccount',

  nestedRecordNamespace: XM,

  // .................................................
  // PRIVILEGES
  //

  

  //..................................................
  // ATTRIBUTES
  //
  
  /**
    @type Number
  */
  guid: SC.Record.attr(Number),

  /**
    @type XM.Opportunity
  */
  source: SC.Record.toOne('XM.Opportunity'),

  /**
    @type XM.AccountInfo
  */
  account: SC.Record.toOne('XM.AccountInfo', {
    isNested: true
  }),

  /**
    @type String
  */
  purpose: SC.Record.attr(String)

};
