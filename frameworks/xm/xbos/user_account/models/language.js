// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XM */
/** @class

  Internally maintained reference list of languages.

  @extends SC.Record
  @version 0.1
*/
XM.Language = SC.Record.extend(
/** @scope XM.Language.prototype */ {

  className: 'XM.Language',
  
  isEditable: NO,

  /**
  @type String
  */
  name: SC.Record.attr(String),

  /**
  @type String
  */
  abbreviationShort: SC.Record.attr(String),
  
  /**
  @type String
  */
  abbreviationLong: SC.Record.attr(String),
  
}) ;

