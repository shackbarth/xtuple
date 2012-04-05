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



//Observe on to unit and update property think about it like project 
//bool true or false 1 True and 2,3,4 False

unitAvailableTypes: function(add,remove) {
  var status = this.get('status'),
	    multiple = this.getPath('UnitType.multiple'),
			unitType = this.getPath('ItemConversionTypeAssignment.unitType');
	if (status == SC.Record.READY_CLEAN) {
	  if (multiple === true){
		   this.set('unitType', this.getPath('ItemConversionTypeAssignment.unitType'));
		} else if (multiple === false) {
		   this.set('unitType', this.getPath('ItemConversionTypeAssignment.unitType'));
		}
	}
},

//..................................................
// METHODS
//

//..................................................
// OBSERVERS
//
fromUnitDidChange: function() {
if (this.get('status') === SC.Record.READY_DIRTY) {
	this.fromUnit.set('isEditable', false);
	this.toUnit.set('isEditable', false);
}
},//.observes('status')


});

