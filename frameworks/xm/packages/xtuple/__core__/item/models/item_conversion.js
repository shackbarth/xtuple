// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_item_conversion');

/**
  @class

  @extends XT.Record
*/
XM.ItemConversion = XT.Record.extend(XM._ItemConversion,
  /** @scope XM.ItemConversion.prototype */ {

  // .................................................
  // CALCULATED PROPERTIES
  //

	/**
		Unit conversion.
	*/	
	unitAvailableTypes: function(){
    var fromUnit = this.get('fromUnit'),
        toUnit = this.get('toUnit'),
				unitType = this.get('unitType');
		if(unitType === 2 || 3 || 4){
			 this.set('toUnit') = this.get('toUnit');
		}
	},
	
  //..................................................
  // METHODS
  //

  //..................................................
  // OBSERVERS
  //

});

