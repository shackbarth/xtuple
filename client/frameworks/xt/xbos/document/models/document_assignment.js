// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */

/** @mixin

  (Document your Model here)

  @version 0.1
*/

XM.DocumentAssignment = XM.Record.extend({
   /** @scope XM.DocumentAssignment.prototype */ {
  
  /**
  @type Number
  */
  source: SC.Record.attr(Number),
  
  /**
  @type XM.Source
  */
  sourceType: SC.Record.attr(String),
  
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

});
