// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */

/** @class

  (Document your Model here)

  @extends XM.DocumentAssignment
*/
XM.ItemDocument = XM.DocumentAssignment.extend(
/** @scope XM.ItemDocument.prototype */ {

  className: 'XM.ItemDocument',

  /**
  @type XM.Item
  */
  item: SC.Record.toOne('XM.Item', {
    inverse:  'comments',
    isMaster: NO,
  }),
  
}) ;
