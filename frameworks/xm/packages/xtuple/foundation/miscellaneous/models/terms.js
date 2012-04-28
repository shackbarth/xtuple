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

  /**
    Calculate a discount date based on a given document date.
    
    @param {XT.DateTime} document date.
    @returns XT.DateTime
  */
  calculateDiscountDate: function(date) {
    return XM.Terms.calculateDiscountDate(this, date);
  },
  
  /**
    Calculate a due date based on a given document date.
    
    @param {XT.DateTime} document date.
    @returns XT.DateTime
  */
  calculateDueDate: function(date) {
    return XM.Terms.calculateDueDate(this, date);
  }

  //..................................................
  // OBSERVERS
  //

});

/**
  Calculate a discount date based on a given document date.
  
  @param {XM.Terms} terms
  @param {XT.DateTime} document date.
  @returns XT.DateTime
*/
XM.Terms.calculateDiscountDate = function(terms, date) {
  return XM.Terms._calculateDate(terms, date, 'discountDays');
}

/**
  Calculate a due date based on a given document date.
  
  @param {XM.Terms} terms
  @param {XT.DateTime} document date.
  @returns XT.DateTime
*/
XM.Terms.calculateDueDate = function(terms, date) {
  return XM.Terms._calculateDate(terms, date, 'dueDays');
}

/** @private
  Calculate a date to advance based on a given document date
  and advancement basis.
  
  @param {XM.Terms} terms
  @param {XT.DateTime} document date.
  @param {String} due date or discount date basis
  @returns XT.DateTime
*/
XM.Terms._calculateDate = function(terms, date, basis) {
  if (!SC.kindOf(date, XT.DateTime)) return false;
  else if (!SC.kindOf(terms, XM.Terms)) return date;
  var termsType = terms.get('termsType'),
      advanceDays = terms.get(basis),
      cutOffDay = terms.get('cutOffDay'),
      result = date;
      
  // handle days
  if (termsType === 'D') {
    result = date.advance({ day: advanceDays });
    
  // handle proximo (day of month)
  } else if (termsType === 'P') {
    result = XT.DateTime.create({ 
      month: date.get('month'), 
      day: advanceDays, 
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
