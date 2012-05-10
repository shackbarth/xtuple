// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_company');

/**
  @class

  @extends XT.Record
*/
XM.Company = XM.Document.extend(XM._Company,
	/** @scope XM.Company.prototype */ {

	documentKey: 'number',


	// .................................................
	// CALCULATED PROPERTIES
	//

	number: SC.Record.attr(String, {
		fromType: function(record, key, value) {
			var segmentSize = XT.session.settings.get('GLCompanySize');
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

