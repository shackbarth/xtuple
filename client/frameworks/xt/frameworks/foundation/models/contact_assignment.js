// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */
sc_require("models/document_assignment");
/** @class

  (Document your Model here)

  @extends XM.DocumentAssignment
  @version 0.1
*/

XM.ContactAssignment = XM.DocumentAssignment.extend( 
/** @scope XM.ContactAssignment.prototype */ {

  className: 'XM.ContactAssignment',
  
  /** 
  @type XM.ContactInfo
  */
  contact: SC.Record.toOne('XM.ContactInfo', { 
    isNested: YES,
    isRequired: YES 
  })

});
