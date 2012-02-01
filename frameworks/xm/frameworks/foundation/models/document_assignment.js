// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XM */
sc_require("models/record");
/** @class

  (Document your Model here)

  @extends XM.Record
  @version 0.1
*/

XM.DocumentAssignment = XM.Record.extend(
/** @scope XM.DocumentAssignment.prototype */ {

  className: 'XM.DocumentAssignment',
  
  nestedRecordNamespace: XM,
  
  /**
  @type Number
  */
  source: SC.Record.attr(Number),
  
  /**
  @type String
  */
  purpose: SC.Record.attr(String),

  // ..........................................................
  // CALCULATED PROPERTIES
  //

  /**
  @type String
  */
  formatPurpose: function() {
    return XM.purpose.get(this.get('purpose'));
  }.property('purpose').cacheable()

})
