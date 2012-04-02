// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_terms');

/**
  @class

  @extends XM.Document
*/
XM.Terms = XM.Document.extend(XM._Terms,
  /** @scope XM.Terms.prototype */ {

  documentKey: 'code',

  // .................................................
  // CALCULATED PROPERTIES
  //

  //..................................................
  // METHODS
  //
  
  calculateDueDate: function(date) {
    return XM.Terms.calculateDueDate(this, date);
  }

  //..................................................
  // OBSERVERS
  //

});

/**
  Calculate a due date based on a given document date.
  
  @param {XM.Terms} terms
  @param {SC.DateTime} document date.
  @returns SC.DateTime
*/
XM.Terms.calculateDueDate = function(terms, date) {
  if (!SC.kindOf(terms, XM.Terms)) return date;
  var termsType = terms.get('termsType'),
      dueDays = terms.get('dueDays'),
      cutOffDay = terms.get('cutOffDay'),
      result = date;
      
  // handle days
  if (termsType === 'D') {
    result = date.advance({ day: dueDays });
    
  // handle proximo (day of month)
  } else if (termsType === 'P') {
    result = SC.DateTime.create({ 
      month: date.get('month'), 
      day: dueDays, 
      year: date.get('year')
    });
    
    // if day has already cut off, then advance to next month
    if (date.get('day') > cutOffDay) {
      result = result.advance({ month: 1 });
    }
  }
  return result
}

XM.Terms.mixin( /** @scope XM.Terms */ {

// Terms Type values
/**
  Days
  
  @static
  @constant
  @type String
  @default D
*/
  DAYS: 'D',

/**
  Proximo
  
  @static
  @constant
  @type String
  @default P
*/
  PROXIMO: 'P'

});
