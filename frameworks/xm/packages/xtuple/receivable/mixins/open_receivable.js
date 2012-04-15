// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @mixin
  
  An abstract mixin with a pending property that calculates the total
  value of all pending applications.
*/
XM.OpenReceivable = /** @scope XM.OpenReceivable.prototype */ {

  /** @private */
  pendingApplicationsLength: 0,
  
  /** @private */
  pendingApplicationsLengthBinding: SC.Binding.from('*pendingApplications.length').oneWay().noDelay(),

  // .................................................
  // CALCULATED PROPERTIES
  //
  
  /**
    Total value of applications that have been created, but not posted, on the receivable
    in the receivable's currency.
    
    @type Money
  */
  pending: function() {
    var applications = this.getPath('pendingApplications'),
        pending = 0;
  
    // loop through all pending applications and add them up
    for (var i = 0; i < applications.get('length'); i++) {
      var application = applications.objectAt(i),
          status = application.get('status'), K = SC.Record;
      if ((status & K.DESTROYED) === 0) {
        pending += application.get('amount');
      }
    }

    return pending.toMoney();
  }.property('pendingApplicationsLength').cacheable()

  //..................................................
  // METHODS
  //

  //..................................................
  // OBSERVERS
  //

};

