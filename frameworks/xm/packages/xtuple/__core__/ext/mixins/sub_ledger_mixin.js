// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @mixin
  
  A mixin that handles totalling for paid and balance amounts.
*/
XM.SubLedgerMixin = 
  /** @scope XM.Subledger.prototype */ {
  
  /**
    Aging control for paid and balance values.
    
    @type SC.DateTime
    @default currentDate
  */
  asOf: null,
  
  /** @private */
  applicationsLength: 0,
  
  /** @private */
  applicationsLengthBinding: SC.Binding.from('*applications.length').oneWay().noDelay(),

  // .................................................
  // CALCULATED PROPERTIES
  //
  
  /**
    Total value of all posted applications.
    
    @type Money
  */
  paid: function() {
    var asOf = this.get('asOf'),
        applications = this.get('applications'),
        paid = 0;
    for (var i = 0; i < applications.get('length'); i++) {
      var application = applications.objectAt(i), 
          postDate = application.get('postDate');
      if (SC.DateTime.compare(asOf, postDate) >= 0) {
        paid = paid + application.get('paid');
      }
    }
    return paid.toMoney();
  }.property('applicationsLength', 'asOf').cacheable(),

  /**
    Total due remaining.
    
    @type Money
  */
  balance: function() {
    var asOf = this.get('asOf'),
        documentDate = this.get('documentDate'),
        amount = this.get('amount') || 0,
        paid = this.get('paid') || 0, ret = new Money(0);
    if (documentDate && SC.DateTime.compareDate(asOf, documentDate) >= 0) {
      ret = (amount - paid).toMoney();
    }
    return ret;
  }.property('amount', 'paid', 'documentDate').cacheable(),

  //..................................................
  // METHODS
  //

  initMixin: function() {
    if (!this.get('asOf')) this.set('asOf', SC.DateTime.create());
  }

  //..................................................
  // OBSERVERS
  //

};

