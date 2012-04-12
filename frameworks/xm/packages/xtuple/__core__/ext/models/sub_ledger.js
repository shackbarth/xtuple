// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================
sc_require('models/taxable_document');
sc_require('mixins/sub_ledger_mixin');
/*globals XM */

/**
  @class
  
  An abstract superclass for Accounts Payable and Accounts Receivable.

  @extends XM.TaxableDocument
  @extends XM.SubLedgerMixin
*/
XM.SubLedger = XM.TaxableDocument.extend(XM.SubLedgerMixin,
  /** @scope XM.Subledger.prototype */ {
  
  numberPolicy: XT.AUTO_OVERRIDE_NUMBER,

  // .................................................
  // CALCULATED PROPERTIES
  //

  //..................................................
  // METHODS
  //
  
  /**
    This dispatches a post function that handles the two step process of creating the record, 
    then posting it. This function may only be called when the record is in a READY_NEW state. 
    
    A function by the name of [className].post(dataHash), where the dataHash is the changeSet of 
    the subclass, must exist on the data source for this to operate properly.
    
    @seealso `commitRecord`
  */
  post: function() {
    var dataHash = this.get('changeSet'),
        store = this.get('store'),
        storeKey = this.get('storeKey'),
        rev = SC.Store.generateStoreKey(),
        that = this,
        className = this.get('className'),
        status = this.get('status'),
        K = SC.Record;
      
    // validate
    if (status !== K.READY_NEW) return false;
    
    // update status of this record
    store.writeStatus(storeKey, K.BUSY_CREATING);
    store.dataHashDidChange(storeKey, rev, true);
    this.notifyPropertyChange('status');
      
    // update status of children
    store._propagateToChildren(storeKey, function(storeKey) {
      var rev = SC.Store.generateStoreKey(),
          rec = store.materializeRecord(storeKey);
      store.writeStatus(storeKey, K.BUSY_CREATING);
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
  },
  
  /**
    If the record is in a READY_NEW state this will call `post`, otherwise will commit normally.
    
    @seealso `post`
  */
  commitRecord: function() {
    var status = this.get('status'),
        K = SC.Record;
    return status === K.READY_NEW ? this.post() : arguments.callee.base.apply(this, arguments);
  },
  
  /**
    Only new records may be destroyed.
  */
  destroy: function() {
    var status = this.get('status'),
        K = SC.Record;
    if (status === K.READY_NEW) {
      return arguments.callee.base.apply(this, arguments);
    }
    return false;
  },
  
  init: function() {
    arguments.callee.base.apply(this, arguments);
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

