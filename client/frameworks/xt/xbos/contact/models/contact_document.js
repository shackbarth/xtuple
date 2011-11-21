// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */

/** @class

  (Document your Model here)

  @extends XM.DocumentAssignment
*/
XM.ContactDocument = XM.DocumentAssignment.extend(
/** @scope XM.ContactDocument.prototype */ {

  className: 'XM.ContactDocument',

  /**
  @type XM.Contact
  */
  contact: SC.Record.toOne('XM.Contact', {
    inverse:  'comments',
    isMaster: NO,
  }),
  
}) ;
