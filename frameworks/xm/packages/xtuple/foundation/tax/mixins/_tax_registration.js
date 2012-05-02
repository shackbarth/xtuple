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
      "create": "MaintainTaxRegistrations",
      "read": true,
      "update": "MaintainTaxRegistrations",
      "delete": "MaintainTaxRegistrations"
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
    @type XM.TaxAuthority
  */
  taxAuthority: SC.Record.toOne('XM.TaxAuthority'),

  /**
    @type String
  */
  number: SC.Record.attr(String, {
    isRequired: true
  }),

  /**
    @type XM.TaxZone
  */
  taxZone: SC.Record.toOne('XM.TaxZone'),

  /**
    @type Date
  */
  effective: SC.Record.attr(XT.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false,
    defaultValue: function() {
      return XT.DateTime.startOfTime();
    }
  }),

  /**
    @type Date
  */
  expires: SC.Record.attr(XT.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false,
    defaultValue: function() {
      return XT.DateTime.endOfTime();
    }
  }),

  /**
    @type String
  */
  notes: SC.Record.attr(String)

};
