// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @namespace
  
  A mixin that handles totalling for paid and balance amounts.
*/
XM.SubLedgerMixin = {
  
  /**
    Aging control for paid and balance values.
    
    @type XT.DateTime
    @default currentDate
  */
  asOf: null,
  
  /** @private */
  applicationsLength: 0,

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
      if (XT.DateTime.compare(asOf, postDate) >= 0) {
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
    var asOf = this.get('asOf');
    var documentDate = this.get('documentDate');
    var amount = this.get('amount') || 0;
    var paid = this.get('paid') || 0, ret = new Money(0);
    if (documentDate && XT.DateTime.compareDate(asOf, documentDate) >= 0) {
      ret = (amount - paid).toMoney();
    }
    return ret;
  }.property('amount', 'paid', 'documentDate').cacheable(),
  
  /**
    Total due remaining.
    
    @type XM.Money
  */
  balanceMoney: null,

  //..................................................
  // METHODS
  //

  /** @private */
  initMixin: function() {
    // default as-of date
    if (!this.get('asOf')) this.set('asOf', XT.DateTime.create());
    
    // observer length changes
    var applications = this.get('applications');
    SC.Binding.from('length', applications).to('applicationsLength', this).oneWay().noDelay().connect();
    
    // set up balanceMoney
    var balanceMoney = this.get('balanceMoney');
    if (!balanceMoney) {
      balanceMoney = XM.Money.create();
      this.set('balanceMoney', balanceMoney);
    }
    SC.Binding.from('currency', this).to('currency', balanceMoney).oneWay().noDelay().connect();
    SC.Binding.from('balance', this).to('localValue', balanceMoney).oneWay().noDelay().connect();
  },

  //..................................................
  // OBSERVERS
  //

};

