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
  period: SC.Record.attr(String),
    
  /**
  @type Number
  */
  frequency: SC.Record.attr(Number),
    
  /**
  @type SC.DateTime
  */
  startDate: SC.Record.attr(SC.DateTime),
  
  /**
  @type SC.DateTime
  */
  endDate: SC.Record.attr(SC.DateTime),
  
  /**
  @type Number
  */
  maximum: SC.Record.attr(Number)
  
};
