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
    
    @type XT.DateTime
    @default currentDate
  */
  asOf: null,
  
  /** @private */
  applicationsLength: 0,

  amount: null,

  /**
    implementations of this mixin must supply a documentDate.
    
    @type XM.DateTime
  */  
  documentDate: null,

  /**
    implementations of this mixin must supply an amount.
    
    @type Money
  */  
  amount: null,

  /**
    implementations of this mixin must supply a paid amount.
    
    @type Money
  */  
  paid: null,
  
  /**
    implementations of this mixin must supply a currency.
    
    @type XM.Currency
  */
  currency: null,

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
    var asOf = this.get('asOf'),
        documentDate = this.get('documentDate'),
        amount = this.get('amount') || 0,
        paid = this.get('paid') || 0, ret = new Money(0);
    if (documentDate && XT.DateTime.compareDate(asOf, documentDate) >= 0) {
      ret = (amount - paid).toMoney();
    }
    return ret;
  }.property('amount', 'paid', 'documentDate').cacheable(),

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
    
  },

  //..................................................
  // OBSERVERS
  //

};

