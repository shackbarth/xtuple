// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
XM.Locale = XM.Record.extend(
/** @scope XM.Locale.prototype */ {

  className: 'XM.Locale',

  createPrivilege: 'MaintainLocales',
  readPrivilege:   'MaintainLocales',
  updatePrivilege: 'MaintainLocales',
  deletePrivilege: 'MaintainLocales',

  /**
  @type String
  */
  code: SC.Record.attr(String,  { isRequired: YES } ),
  
  /**
  @type String
  */
  description: SC.Record.attr(String),
  
  /**
  @type String
  */
  notes: SC.Record.attr(String),
  
  /**
  @type XM.Language
  */
  language: SC.Record.toOne('XM.Language'),
  
  /**
  @type XM.Country
  */
  country: SC.Record.toOne('XM.Country'),
  
  /**
  @type String
  */
  errorColor: SC.Record.attr(String),
  
  /**
  @type String
  */
  warningColor: SC.Record.attr(String),
  
  /**
  @type String
  */
  emphasisColor: SC.Record.attr(String),
  
  /**
  @type String
  */
  altEmphasisColor: SC.Record.attr(String),
  
  /**
  @type String
  */
  expiredColor: SC.Record.attr(String),
  
  /**
  @type String
  */
  futureColor: SC.Record.attr(String),
  
  /**
  @type Number
  */
  currencyScale: SC.Record.attr(Number),
  
  /**
  @type Number
  */
  salesPriceScale: SC.Record.attr(Number),
  
  /**
  @type Number
  */
  purchasePriceScale: SC.Record.attr(Number),
  
  /**
  @type Number
  */
  extendedPriceScale: SC.Record.attr(Number),
  
  /**
  @type Number
  */
  costScale: SC.Record.attr(Number),
  
  /**
  @type Number
  */
  quantityScale: SC.Record.attr(Number),
  
  /**
  @type Number
  */
  quantityPerScale: SC.Record.attr(Number),
  
  /**
  @type Number
  */
  unitRatioScale: SC.Record.attr(Number),
  
  /**
  @type Number
  */
  percentScale: SC.Record.attr(Number),

}) ;

