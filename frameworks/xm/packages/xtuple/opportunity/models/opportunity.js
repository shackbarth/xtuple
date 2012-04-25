// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_opportunity');


/**
  @class

  @extends XM.Document
  @extends XM.Documents
*/
XM.Opportunity = XM.Document.extend(XM._Opportunity, XM.Documents,
  /** @scope XM.Opportunity.prototype */ {

  numberPolicy: XT.AUTO_NUMBER,

  // .................................................
  // CALCULATED PROPERTIES
  //

  //..................................................
  // METHODS
  //

  //..................................................
  // OBSERVERS
  //

  assignedToDidChange: function() {
    if (this.isNotDirty()) return;
    var assignedTo = this.get('assignedTo'),
        assignDate = this.get('assignDate');
     
    if(assignedTo && !assignDate) {
      this.set('assignDate', XT.DateTime.create());
    }
  }.observes('assignedTo')

});
