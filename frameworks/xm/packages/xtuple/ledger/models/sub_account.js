// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_sub_account');

/**
  @class

  @extends XT.Record
*/
XM.SubAccount = XM.Document.extend(XM._SubAccount,
	/** @scope XM.SubAccount.prototype */ {

	documentKey: 'number',

	// .................................................
	// CALCULATED PROPERTIES
	//

	number: SC.Record.attr(String, {
		fromType: function(record, key, value) {
			var segmentSize = XT.session.settings.get('GLSubaccountSize');
			return value.substr(0,segmentSize)
		} 
	}),

	//..................................................
	// METHODS
	//

	//..................................................
	// OBSERVERS
	//

});

