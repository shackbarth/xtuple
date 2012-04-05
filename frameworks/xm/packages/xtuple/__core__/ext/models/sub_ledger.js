// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================
sc_require('models/taxable_document');
/*globals XM */

/**
  @class
  
  An abstract superclass for Accounts Payable and Accounts Receivable.

  @extends XM.TaxableDocument
*/
XM.SubLedger = XM.TaxableDocument.extend(
  /** @scope XM.Subledger.prototype */ {
  
  numberPolicy: XT.AUTO_OVERRIDE_NUMBER,
  
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
    
    @type Number
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
    return SC.Math.round(paid, XT.MONEY_SCALE);
  }.property('applicationsLength', 'asOf').cacheable(),

  /**
    Total due remaining.
    
    @type Number
  */
  balance: function() {
    var asOf = this.get('asOf'),
        documentDate = this.get('documentDate'),
        amount = this.get('amount') || 0,
        paid = this.get('paid') || 0, ret = 0;
    if (documentDate && SC.DateTime.compareDate(asOf, documentDate) >= 0) {
      ret = SC.Math.round(amount - paid, XT.MONEY_SCALE);
    }
    return ret;
  }.property('amount', 'paid', 'documentDate').cacheable(),

  //..................................................
  // METHODS
  //
  
  /**
    For new records this dispatches a post function that handles the two
    step process of creating the record, then posting it. Otherwise it
    commits normally. A function by the name of [className].post(dataHash), where
    the dataHash is the changeSet of the subclass, must exist on the data source 
    for this to operate properly.
  */
  commitRecord: function() {
    var status = this.get('status'),
        className = this.get('className');
    
    // if new dispatch post function
    if (status === SC.Record.READY_NEW) {
      var dataHash = this.get('changeSet'),
          store = this.get('store'),
          storeKey = this.get('storeKey'),
          rev = SC.Store.generateStoreKey(),
          that = this;
      
      // update status of this record
      store.writeStatus(storeKey, SC.Record.BUSY_CREATING);
      store.dataHashDidChange(storeKey, rev, true);
      this.notifyPropertyChange('status');
        
      // update status of children
      store._propagateToChildren(storeKey, function(storeKey) {
        var rev = SC.Store.generateStoreKey(),
            rec = store.materializeRecord(storeKey);
        store.writeStatus(storeKey, SC.Record.BUSY_CREATING);
        store.dataHashDidChange(storeKey, rev, true);
        rec.notifyPropertyChange('status');
      });
      
      // callback - notify store of results
      callback = function(err, result) {
        if (err) store.dataSourceDidError(storeKey, err);
        else store.dataSourceDidComplete(storeKey);
      }

      // define call
      dispatch = XT.Dispatch.create({
        className: className,
        functionName: 'post',
        parameters: dataHash,
        target: that,
        action: callback
      });
      
      // do it
      store.dispatch(dispatch);
      return this;
    }
    return arguments.callee.base.apply(this, arguments);
  },
  
  /**
    Only new records may be destroyed.
  */
  destroy: function() {
    var status = this.get('status');
    if (status === SC.Record.READY_NEW) {
      return arguments.callee.base.apply(this, arguments);
    }
    return false;
  },
  
  init: function() {
    arguments.callee.base.apply(this, arguments);
    this.currencyRate.set('isEditable', false);
    this.closeDate.set('isEditable', false);
    this.createdBy.set('isEditable', false);
    if (!this.get('asOf')) this.set('asOf', SC.DateTime.create());
  },

  //..................................................
  // OBSERVERS
  //
  
  validate: function() {
    var errors = arguments.callee.base.apply(this, arguments), 
        val, err;

    // validate Lines
    isErr = this.get('miscTax') > this.get('amount');
    err = XT.errors.findProperty('code', 'xt1005');
    this.updateErrors(err, isErr);

    return errors;
  }.observes('amount', 'miscTax'),
  
  termsDidChange: function() {
    if (this.isNotDirty()) return;
    var documentDate = this.get('documentDate'),
        dueDate = this.get('dueDate'),
        terms = this.get('terms');
    if (documentDate && terms && !dueDate) {
      dueDate = terms.calculateDueDate(documentDate);
      this.set('dueDate', dueDate);
    }
  }.observes('terms', 'documentDate'),
  
  statusDidChange: function() {
    if (this.get('status') == SC.Record.READY_CLEAN) {
      this.documentDate.set('isEditable', false);
      this.documentType.set('isEditable', false);
      this.number.set('isEditable', false);
      this.orderNumber.set('isEditable', false);
      this.terms.set('isEditable', false);
      this.currency.set('isEditable', false);
    }
  }.observes('status')
  
});

XM.SubLedger.mixin( /** @scope XM.SubLedger */ {

/**
  Credit Memo document type.
  
  @static
  @constant
  @type String
  @default C
*/
  CREDIT_MEMO: 'C',

/**
  Debit Memo document type.
  
  @static
  @constant
  @type String
  @default D
*/
  DEBIT_MEMO: 'D',

/**
  Invoice document type.
  
  @static
  @constant
  @type String
  @default I
*/
  INVOICE: 'I',
  
/**
  Voucher document type.
  
  @static
  @constant
  @type String
  @default V
*/
  VOUCHER: 'V',

/**
  Customer Deposit document type.
  @static
  @constant
  @type String
  @default R
*/
  CUSTOMER_DEPOSIT: 'R'

});

