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

  _xm_assignedToDidChange: function() {
    if(this.isDirty()) {
      var assignedTo = this.get('assignedTo'),
          status = this.get('status');
       
      if(status & SC.Record.READY && assignedTo) this.set('assignDate', SC.DateTime.create());
    }
  }.observes('assignedTo')

});
