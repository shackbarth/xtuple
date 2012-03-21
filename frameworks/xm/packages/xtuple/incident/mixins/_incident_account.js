// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.IncidentAccount
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._IncidentAccount = {
  /** @scope XM.IncidentAccount.prototype */
  
  className: 'XM.IncidentAccount',

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
    @type XM.Incident
  */
  source: SC.Record.toOne('XM.Incident', {
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
