// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XM */

/** @class

  (Document your Model here)

  @extends XM.Record
  @version 0.1
*/

XM.Currency = XM.Record.extend(
/** @scope XM.Currency.prototype */ {

  className: 'XM.Currency',

  createPrivilege: 'CreateNewCurrency',
  readPrivilege:   'MaintainCurrencies',
  updatePrivilege: 'MaintainCurrencies',
  deletePrivilege: 'MaintainCurrencies',

  /**
  @type String
  */
  name: SC.Record.attr(String),
  
  /**
  @type String
  */
  symbol: SC.Record.attr(String),
  
  /**
  @type String
  */
  abbreviation: SC.Record.attr(String),
  
  /**
  @type Boolean
  */
  isBase: SC.Record.attr(Boolean),
  
  /**
  @type XM.CurrencyRate
  */
  rates: SC.Record.toMany('XM.CurrencyRate', {
    isNested: YES,
    inverse: 'currency',
  }),

}) ;

