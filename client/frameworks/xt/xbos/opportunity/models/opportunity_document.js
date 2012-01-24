// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */

/** @class

  (Document your Model here)

  @extends XM.DocumentAssignment
*/
XM.OpportunityDocument = XM.DocumentAssignment.extend(
/** @scope XM.OpportunityDocument.prototype */ {

  className: 'XM.OpportunityDocument',

  /**
  @type XM.Opportunity
  */
  opportunity: SC.Record.toOne('XM.Opportunity', {
    inverse:  'documents',
    isMaster: NO,
  })
  
}) ;
