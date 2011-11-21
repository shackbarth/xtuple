// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */

/** @class

  (Document your Model here)

  @extends XM.Record
  @version 0.1
*/

XM.DocumentAssignment = XM.Record.extend(
/** @scope XM.DocumentAssignment.prototype */ {

  className: 'XM.DocumentAssignment',
  
  /**
  @type Number
  */
  target: SC.Record.attr(Number),
  
  /**
  @type XM.Source
  */
  targetType: SC.Record.toOne('XM.Type'),
  
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
