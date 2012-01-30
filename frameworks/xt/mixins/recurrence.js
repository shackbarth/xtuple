// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// =========================================================================
/*globals XT */

/** @mixin

  
*/

XM.Recurrence = {

  /**
  @type String
  */
  recurrencePeriod: SC.Record.attr(String),
    
  /**
  @type Number
  */
  recurrenceFrequency: SC.Record.attr(Number),
    
  /**
  @type SC.DateTime
  */
  recurrenceStart: SC.Record.attr(SC.DateTime),
  
  /**
  @type SC.DateTime
  */
  recurrenceEnd: SC.Record.attr(SC.DateTime),
  
  /**
  @type Number
  */
  recurrenceMax: SC.Record.attr(Number)
  
};
