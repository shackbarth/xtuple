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


availableTypes: function() {
  var selectedTypes = this.get('selectedTypes'),
	    allTypes = XM.UnitType.fetch();
  for (var i = 0; i < allTypes.get('length'); i++) {
	debugger;
		var unitAvailableTypes = selectedTypes.findProperty('guid', allTypes.objectAt(i).get('guid'));
		return this.unitAvailableTypes;
  }	
}.property('selectedTypes').cachable();


selectedTypes: function() {
  var unitTypeId = this.getPath('ItemConversionTypeAssignment.unitType');
	debugger;
  this.set('selectedTypes', unitTypeId);
}

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

XM.UnitType.fetch() {
  if (!this._xm_types) {
	  this._xm_types = XT.store.find(XM.UnitType);
		debugger;
	}
  return this.xm_types;
	debugger;
}
