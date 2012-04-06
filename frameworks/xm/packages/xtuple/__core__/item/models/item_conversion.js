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
	    allTypes = this.get('XMunitTypeFetch');
  for (var i = 0; i < allTypes.get('length'); i++) {
		var unitAvailableTypes = selectedTypes.findProperty('guid', allTypes.objectAt(i).get('guid'));
		return this.unitAvailableTypes;
  }	
}.property('selectedTypes').cacheable(),

selectedTypes: function() {
  var unitTypeId = this.getPath('ItemConversionTypeAssignment.unitType');
  this.set('selectedTypes', unitTypeId);
},

//..................................................
// METHODS
//

//..................................................
// OBSERVERS
//

statusDidChange: function(){
  var status = this.get('status');
  if (status === SC.Record.READY_CLEAN) {
    this.availableTypes();
  }
}.observes('status'),

fromUnitDidChange: function() {
if (this.get('status') === SC.Record.READY_DIRTY) {
	this.fromUnit.set('isEditable', false);
	this.toUnit.set('isEditable', false);
}
},//.observes('status')

//IF STATUS READY NEW OR READY CLEAN OR READY DIRTY


XMunitTypeFetch: function() {
  var _xm_types;
  if (!this._xm_types) {
	  this._xm_types = XT.store.find(XM.UnitType);
	}
  return this._xm_types;
},

});


