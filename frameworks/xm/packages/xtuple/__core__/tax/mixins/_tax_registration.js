// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.TaxRegistration
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._TaxRegistration = {
  /** @scope XM.TaxRegistration.prototype */
  
  className: 'XM.TaxRegistration',

  

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainChartOfAccounts",
      "read": true,
      "update": "MaintainChartOfAccounts",
      "delete": "MaintainChartOfAccounts"
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
  relationType: SC.Record.attr(String, {
    label: '_relationType'.loc()
  }),

  /**
    @type XM.TaxAuthority
  */
  taxAuthority: SC.Record.toOne('XM.TaxAuthority', {
    label: '_taxAuthority'.loc()
  }),

  /**
    @type String
  */
  number: SC.Record.attr(String, {
    label: '_number'.loc()
  }),

  /**
    @type XM.TaxZone
  */
  taxZone: SC.Record.toOne('XM.TaxZone', {
    label: '_taxZone'.loc()
  }),

  /**
    @type Date
  */
  effective: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d',
    label: '_effective'.loc()
  }),

  /**
    @type Date
  */
  expires: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d',
    label: '_expires'.loc()
  }),

  /**
    @type String
  */
  notes: SC.Record.attr(String, {
    label: '_notes'.loc()
  })

};
