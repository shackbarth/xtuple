// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XM */
/** @class

  (Document your Model here)

  @extends XM.Record
  @version 0.2
*/

XM.AccountInfo = XM.Record.extend(
/** @scope XM.AccountInfo.prototype */ {

  className: 'XM.AccountInfo',

  /**
  @type String
  */
  number: SC.Record.attr(String),
  
  /**
  @type String
  */
  name: SC.Record.attr(String, {
    isRequired: YES
  }),
  
  /**
  @type Boolean
  */
  isActive: SC.Record.attr(Boolean),

});

