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
XM.Company = XT.Record.extend(XM._Company,
/** @scope XM.Company.prototype */ {

// .................................................
// CALCULATED PROPERTIES
//

number: SC.Record.attr(Number, {
  toType: function(record, key, value) {
  if(value) return value.get('length') <= 2 ? value : null;
  }
}),

//..................................................
// METHODS
//

//..................................................
// OBSERVERS
//

});

