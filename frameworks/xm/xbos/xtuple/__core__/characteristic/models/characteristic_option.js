// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('xbos/__generated__/_characteristic_option');

/**
  @class

  @extends XM._CharacteristicOption
*/
XM.CharacteristicOption = XM._CharacteristicOption.extend(
  /** @scope XM.CharacteristicOption.prototype */ {

  // .................................................
  // CALCULATED PROPERTIES
  //

  //..................................................
  // METHODS
  //

  //..................................................
  // OBSERVERS
  //

  // On value change, check for duplicates
  _xm_valueDidChange: function() {
    var _xm_characteristic = this.get('characteristic');
    _xm_characteristic.validate();
  }.observes('value')

});

