// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XM */

/** @class

  Provides special number handling capabilities for documents.

  @extends XM.Record
*/

XM.AccountDocument = XM.Document.extend(
/** @scope XM.Document.prototype */ {

  numberPolicySetting: 'CRMAccountNumberGeneration',
  
  // ..........................................................
  // CALCULATED PROPERTIES
  //
  
  // ..........................................................
  // METHODS
  //

  keyDidChange: function() {
    // we want to check account for duplicates since it is the parent of all
    var oldName = this.get('className');
    this.set('className', 'XM.Account');
    arguments.callee.base.apply(this, arguments) 
    this.set('className', oldName);
  }

  // ..........................................................
  // OBSERVERS
  //


});





