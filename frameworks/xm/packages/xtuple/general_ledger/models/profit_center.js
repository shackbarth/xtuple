// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_profit_center');

/**
  @class

  @extends XT.Record
*/
XM.ProfitCenter = XM.Document.extend(XM._ProfitCenter,
	/** @scope XM.ProfitCenter.prototype */ {

	documentKey: 'number',

	// .................................................
	// CALCULATED PROPERTIES
	//

	number: SC.Record.attr(String, {
		fromType: function(record, key, value) {
			var segmentSize = XT.session.settings.get('GLProfitSize');
			return value.substr(0,segmentSize);
		} 
	}),

	//..................................................
	// METHODS
	//

	//..................................................
	// OBSERVERS
	//

});

