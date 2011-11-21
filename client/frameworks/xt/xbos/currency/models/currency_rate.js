// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */

/** @class

  (Document your Model here)

  @extends XM.Record
  @version 0.1
*/

XM.CurrencyRate = XM.Record.extend(
/** @scope XM.CurrencyRate.prototype */ {

  className: 'XM.CurrencyRate',

  /**
  @type XM.Currency
  */
  currency: SC.Record.toOne("XM.Currency", {
    inverse:  "rates",
    isMaster: NO
  }),
  
  /**
  @type Number
  */
  rate: SC.Record.attr(Number),
  
  /**
  @type SC.DateTime
  */
  effective: SC.Record.attr(SC.DateTime, { format: '%Y-%m-%d' }),
  
  /**
  @type SC.DateTime
  */
  expires: SC.Record.attr(SC.DateTime, { format: '%Y-%m-%d' }),

}) ;
