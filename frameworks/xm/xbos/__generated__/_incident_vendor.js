// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.IncidentVendor
  @class

  This code is automatically generated and will be over-written. Do not edit directly.

  @extends XM.Record
*/
XM._IncidentVendor = XM.Record.extend(
  /** @scope XM.IncidentVendor.prototype */ {
  
  className: 'XM.IncidentVendor',

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
    @type XM.Incident
  */
  source: SC.Record.toOne('XM.Incident'),

  /**
    @type XM.VendorInfo
  */
  vendor: SC.Record.toOne('XM.VendorInfo', {
    isNested: true
  }),

  /**
    @type String
  */
  purpose: SC.Record.attr(String)

});
