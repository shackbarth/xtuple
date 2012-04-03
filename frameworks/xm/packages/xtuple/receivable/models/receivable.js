// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_receivable');

/**
  @class

  @extends XM.TaxableDocument
*/
XM.Receivable = XM.TaxableDocument.extend(XM._Receivable,
  /** @scope XM.Receivable.prototype */ {

  numberPolicy: XT.AUTO_OVERRIDE_NUMBER,

  // .................................................
  // CALCULATED PROPERTIES
  //

  /**
    @type Number
  */
  balance: function() {
    var amount = this.get('amount') || 0,
        paid = this.get('paid') || 0;
    return SC.Math.round(amount - paid, XT.MONEY_SCALE);
  }.property('amount', 'paid').cacheable(),

  //..................................................
  // METHODS
  //
  
  /**
    For new records this dispatches a function here that handles the two
    step process of creating the record, then posting it. Otherwise it
    commits normally.
  */
  commitRecord: function() {
    var status = this.get('status');
    
    // if new dispatch post function
    if (status === SC.Record.READY_NEW) {
      var receivable = this.get('changeSet'),
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
        className: 'XM.Receivable',
        functionName: 'post',
        parameters: receivable,
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
    this.paid.set('isEditable', false);
    this.currencyRate.set('isEditable', false);
    this.closeDate.set('isEditable', false);
    this.createdBy.set('isEditable', false);
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
  
  amountDidChange: function() {
    if (this.isNotDirty()) return;
    var amount = this.get('amount') || 0,
        commissionPct = this.getPath('customer.commission') || 0,
        commissionDue = amount * commissionPct / 100;
    this.setIfChanged('commissionDue', commissionDue);
  }.observes('customer', 'amount'),
  
  termsDidChange: function() {
    var documentDate = this.get('documentDate'),
        dueDate = this.get('dueDate'),
        terms = this.get('terms');
    if (documentDate && terms && !dueDate) {
      dueDate = terms.calculateDueDate(documentDate);
      this.set('dueDate', dueDate);
    }
  }.observes('terms', 'documentDate'),
  
  customerDidChange: function() {
    if (this.isNotDirty()) return;
    var customer = this.get('customer');
    if (customer) {
      this.setIfChanged('terms', customer.get('terms'));
      this.setIfChanged('salesRep', customer.get('salesRep'));
      this.setIfChanged('currency', customer.get('currency'));
    }
  }.observes('customer'),
  
  statusDidChange: function() {
    if (this.get('status') == SC.Record.READY_CLEAN) {
      this.customer.set('isEditable', false);
      this.documentDate.set('isEditable', false);
      this.documentType.set('isEditable', false);
      this.number.set('isEditable', false);
      this.orderNumber.set('isEditable', false);
      this.terms.set('isEditable', false);
      this.customer.set('isEditable', false);
      this.currency.set('isEditable', false);
    }
  }.observes('status')
  
});

XM.Receivable.mixin( /** @scope XM.Receivable */ {

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
  Customer Deposit document type.
  @static
  @constant
  @type String
  @default R
*/
  CUSTOMER_DEPOSIT: 'R'

});

