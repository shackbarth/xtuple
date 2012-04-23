// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_address_info');
sc_require('models/address');

/**
  @class

  @extends XT.Record
*/
XM.AddressInfo = XT.Record.extend(XM._AddressInfo,
  /** @scope XM.AddressInfo.prototype */ {

  // .................................................
  // CALCULATED PROPERTIES
  //

  //..................................................
  // METHODS
  //
  
  /**
    A formatted address that includes city, state and country.
    
    @return {String}
  */
  formatShort: function() {return XM.Address.formatShort(this) },

  //..................................................
  // OBSERVERS
  //

});

