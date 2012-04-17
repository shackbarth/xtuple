// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XM */
/** @class

  (Document your Model here)

  @extends XT.Record
*/

XM.DocumentAssignment = XT.Record.extend(
/** @scope XM.DocumentAssignment.prototype */ {

  /**
    Walk like a duck.
  */
  isDocumentAssignment: true,

  // .................................................
  // CALCULATED PROPERTIES
  //

  // ..........................................................
  // METHODS
  //

  /**
    If status changes to DESTROYED, remove object from documents 
    array on the parent record.
  */
  destroy: function() {
    var record = this.get('parentRecord'),
        docs;

    docs = record.get('documents');
    docs.removeObject(this);
  }

  // ..........................................................
  // OBSERVERS
  //

});
