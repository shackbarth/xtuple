// ==========================================================================
// Project:   XM.Source
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */
/** @class

  (Document your Model here)

  @extends XM.Record
  @version 0.1
*/
XM.Source = XM.Record.extend(
/** @scope XM.Source.prototype */ {

  className:    'XM.Source',

  /**
  @type String
  */
  module:       SC.Record.attr(String),
  
  /**
  @type String
  */
  description:  SC.Record.attr(String),
  
});
