// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_cash_receipt');
sc_require('models/cash_receipt_application');

/**
  @class

  @extends XM.Document
*/
XM.CashReceipt = XM.Document.extend(XM._CashReceipt,
  /** @scope XM.CashReceipt.prototype */ {

  numberPolicy: XT.AUTO_NUMBER,

  applications: [],
  
  /** @private */
  applicationsLength: 0,
  
  /** @private */
  applicationsLengthBinding: SC.Binding.from('*applications.length').oneWay().noDelay(),

  /** @private */
  detailsLength: 0,
  
  /** @private */
  detailsLengthBinding: SC.Binding.from('*details.length').oneWay().noDelay(),
  
  /** @private */
  receivablesLength: 0,
  
  /** @private */
  receivablesLengthBinding: SC.Binding.from('*receivables.length').oneWay().noDelay(),
  
  /**
    Total amount applied.
  */
  applied: 0,
  
  /**
    Total discount taken.
    
    @type Number
  */
  discount: 0,
  
  /**
    Indicates whether to include outstanding credit memos in applications array.
    
    @type Boolean
    @default false
  */
  includeCredits: false,
  
  // .................................................
  // CALCULATED PROPERTIES
  //
  
  /**
    Total unapplied.
  */
  balance: function() {
    var amount = this.get('amount') || 0,
        applied = this.get('applied');
        
    return SC.Math.round(amount - applied, XT.MONEY_SCALE);
  }.property('amount', 'applied').cacheable(),
  
  /**
    Return an array of applications filtered by the `includeCredits` 
    property and sorted by due date.
  */
  filteredApplications: function() {
    var applications = this.get('applications'),
        includeCredits = this.get('includeCredits'),
        ret;
        
    // filter results
    ret = applications.filter(function(application) {
      var documentType = application.getPath('receivable.documentType');

      return application.get('applied') > 0 || 
             includeCredits ||
             documentType === XM.Receivable.INVOICE ||
             documentType === XM.Receivable.DEBIT_MEMO;
    }, this);
    
    return ret.sort(this._xm_sort);
  }.property('includeCredits', 'applicationsLength').cacheable(),
  
  /**
    The earliest date by which the application date may be set to.
  */
  minApplyDate: function() {
    var details = this.get('details'), minDate = false;
    for (var i = 0; i < details.get('length'); i++) {
      var docDate = details.objectAt(i).getPath('receivable.documentDate');
      if (minDate) {
        minDate = SC.DateTime.compareDate(minDate, docDate) < 0 ? docDate : minDate;
      } else {
        minDate = docDate;
      }
    }
    return minDate;
  }.property('detailsLength'),
  
  /**
    An array of open receivables for the selected `customer`. If the
    the cash receipt is posted this will return no results.
  */
  receivables: function() {
    if (!this._xm_receivables) this._xm_receivables = [];
    var customer = this.get('customer'),
        isPosted = this.get('isPosted'),
        store = this.get('store');

    // get receivables according to situation   
    if (customer && isPosted === false) {
      if (!this._xm_query) {
        this._xm_query = SC.Query.local(XM.CashReceiptReceivable, {
          conditions: "customer = {customer} AND isOpen = YES",
          orderBy: "dueDate"
        })
      }
      this._xm_query.setIfChanged('parameters', { customer: customer });
      this._xm_receivables = store.find(this._xm_query);
      return this._xm_receivables;
    } 
    return [];
  }.property('customer', 'isPosted').cacheable(),
  
  //..................................................
  // METHODS
  //
  
  /**
    Apply the balance of the cash receipt to as many open `receivables`
    as possible. Credits are applied first if `includeCredits` is true,
    the balance is then applied to receivables ordered by date.
  */
  applyBalance: function() {
    if (this.get('isPosted')) return;
    var includeCredits = this.get('includeCredits'),
        applications = this.get('applications'), list;
       
    // loop through credits first
    if (includeCredits) {
      // create a filtered list
      list = applications.filter(function(application) {
        var documentType = application.getPath('receivable.documentType');
        return documentType === XM.Receivable.CREDIT_MEMO ||
               documentType === XM.Receivable.CUSTOMER_DEPOSIT;
      }, this);
      
      // loop through and apply
      for (var i = 0; i < list.get('length'); i++) {
        list.objectAt(i).applyBalance();
      }
    }
  
    // now process debits
    list = applications.filter(function(application) {
      var documentType = application.getPath('receivable.documentType');
      return documentType === XM.Receivable.INVOICE ||
             documentType === XM.Receivable.DEBIT_MEMO;
    }, this).sort(this._xm_sort);
    
    // loop through and apply
    var n = 0;
    while (n < list.get('length') && this.get('balance') > 0) {
      list.objectAt(n).applyBalance();
      n++;
    }
  },
  
  /**
    Post a cash receipt. If the cash receipt is 
    in a dirty state, this function will return false.

    @returns Receiver
  */
  post: function() { 
    if(this.get('isPosted') ||
       this.isDirty()) return false; 
    var that = this, dispatch,
        id = this.get('id');
    
    // define callback
    callback = function(err, result) {
      that.refresh();
    }
    
    // set up
    dispatch = XT.Dispatch.create({
      className: 'XM.CashReceipt',
      functionName: 'post',
      parameters: id,
      target: that,
      action: callback
    });
    this.log("Post Cash Receipt: %@".fmt(id));
    
    // do it
    this.get('store').dispatch(dispatch);
    return this;
  },
  
  /**
    Void a Cash Receipt. If the document is in a dirty state, this 
    function will return false.
    
    @returns Receiver
  */
  void: function() { 
    if(!this.get('isPosted') ||
       this.get('isVoid') ||
       this.isDirty()) return false; 
    var that = this, dispatch,
        id = this.get('id');
    
    // define callback
    callback = function(err, result) {
      that.refresh();
    }
    
    // set up
    dispatch = XT.Dispatch.create({
      className: 'XM.CashReceipt',
      functionName: 'void',
      parameters: id,
      target: that,
      action: callback
    });
    this.log("Void Cash Receipt: %@".fmt(id));
    
    // do it
    this.get('store').dispatch(dispatch);
    return this;
  },
  
  /**
    Update the amount applied.
    
    @param {Number} amount to add
    @returns Number
  */
  updateApplied: function(amount) {
    var applied = SC.Math.round(this.get('applied') + amount, XT.MONEY_SCALE);
    this.set('applied', applied);
    return applied;
  },

  /**
    Update the discount taken.
    
    @param {Number} amount to add
    @returns Number
  */  
  updateDiscount: function(amount) {
    var discount = SC.Math.round(this.get('discount') + amount, XT.MONEY_SCALE);
    this.set('discount', discount);
    return discount;
  },
  
  /** @private
    sort array on due date
  */
  _xm_sort: function(a,b) {
    var aDate = a.getPath('receivable.dueDate'),
        bDate = b.getPath('receivable.dueDate');
    return SC.DateTime.compareDate(aDate, bDate);
  },

  //..................................................
  // OBSERVERS
  //
  
  currencyDidChange: function() {
    var distributionDate = this.get('distributionDate'),
        currency = this.get('currency'),
        that = this;

    if (distributionDate && currency) {
      // define the callback
      callback = function(err, currencyRate) {
        if (!err) that.set('currencyRate', currencyRate.get('rate'));
      }
      
      // request a rate
      XM.Currency.rate(currency, distributionDate, callback);
    }
  }.observes('currency', 'distributionDate'),
  
  customerDidChange: function() {
    if (this.get('customer')) this.customer.set('isEditable', false);
  }.observes('customer'),
  
  detailsLengthDidChange: function() {
    var details = this.get('details'),
        applications = this.get('applications'),
        isUpdated = false,
        isNotFixedCurrency = details.get('length') ? false : true;

    // currency is only editable when no detail
    this.currency.set('isEditable', isNotFixedCurrency);
    this.currencyRate.set('isEditable', isNotFixedCurrency);
    
    // process detail
    for (var i = 0; i < details.get('length'); i++) {
      var detail = details.objectAt(i),
          receivable = detail.get('receivable'),
          application = applications.findProperty('receivable', receivable),
          status = detail.get('status');
          
      // if not found make one
      if ((status & SC.Record.DESTROYED) === 0) {
        if (!application) {
          application = XM.CashReceiptApplication.create();
          application.set('cashReceipt', this),
          application.set('cashReceiptDetail', detail),
          application.set('receivable', receivable),
          applications.pushObject(application);
          isUpdated = true;
          
        // if found, add detail if necessary
        } else if (!application.get('cashReceiptDetail')) {
          application.set('cashReceiptDetail', detail);
          isUpdated = true;
        }
        
        // Update the cash receipt totals
        if (isUpdated) {
          this.updateApplied(application.get('applied'));
          this.updateDiscount(application.get('discount'));
        }
      }
    }
  }.observes('detailsLength').cacheable(),
  
  datesDidChange: function() {
    var minApplyDate = this.get('minApplyDate'),
        applicationDate = this.get('applicationDate'),
        distributionDate = this.get('distributionDate');
     
    // application date can not be less than the minimum apply date
    if (minApplyDate && SC.DateTime.compareDate(applicationDate, minApplyDate) < 0) {
      applicationDate = minApplyDate;
      this.set('applicationDate', applicationDate);
    }
    
    // distribution date can not be greater than the application date
    if (SC.DateTime.compareDate(distributionDate, applicationDate) > 0) {
      this.set('distributionDate', applicationDate);
    }    
  }.observes('minApplyDate', 'applicationDate', 'distributionDate'),

  receivablesLengthDidChange: function() {
    var receivables = this.get('receivables'),
        applications = this.get('applications');

    // process
    for (var i = 0; i < receivables.get('length'); i++) {
      var receivable = receivables.objectAt(i),
          application = applications.findProperty('receivable', receivable);
          
      // if not found make one
      if (!application) {
        application = XM.CashReceiptApplication.create();
        application.set('cashReceipt', this);
        application.set('receivable', receivable);
        applications.pushObject(application);
      }
    }
  }.observes('receivablesLength').cacheable()

});

// class constants and methods
XM.CashReceipt.mixin(
   /** @scope XM.CashReceipt */ {

  //..................................................
  // CONSTANTS
  //

  /**
    Check funds type.
    
    @static
    @constant
    @type String
    @default C
  */
  CHECK: 'C',

  /**
    Certified Check funds type.
    
    @static
    @constant
    @type String
    @default T
  */
  CERTIFIED_CHECK: 'T',

  /**
    Master Card funds type.
    
    @static
    @constant
    @type String
    @default M
  */
  MASTER_CARD: 'M',
  
  /**
    Visa funds type.
    
    @static
    @constant
    @type String
    @default V
  */
  VISA: 'V',

  /**
    American Express funds type.
    @static
    @constant
    @type String
    @default A
  */
  AMERICAN_EXPRESS: 'A',
  
  /**
    Discover card funds type.
    
    @static
    @constant
    @type String
    @default D
  */
  DISCOVER_CARD: 'D',

  /**
    Other credit card funds type.
    @static
    @constant
    @type String
    @default R
  */
  OTHER_CREDIT_CARD: 'R',
  
  /**
    Cash funds type.
    
    @static
    @constant
    @type String
    @default K
  */
  CASH: 'K',

  /**
    Customer Deposit document type.
    @static
    @constant
    @type String
    @default W
  */
  WIRE_TRANSFER: 'W',
  
  /**
    Other funds type.
    @static
    @constant
    @type String
    @default O
  */
  OTHER: 'O',
  
  //..................................................
  // METHODS
  //
  
  /**
    Post an array of cash receipts. If any of the cash receipts passed 
    are posted or in a dirty state, this function will return false.

    @params {SC.Array} array of cash receipts
    @returns Receiver
  */
  post: function(cashReceipts) { 
    var that = this, dispatch,
        ids = [];
        
    if(!cashReceipts || !cashReceipts.get('length')) return false;
    
    for(var i = 0; i < cashReceipts.get('length'); i++) {
      var cashReceipt = cashReceipts.objectAt(i);
      if(cashReceipt.get('isPosted') || cashReceipt.isDirty()) return false;
      ids.push(cashReceipt.get('id'));
    }
    
    // define callback
    callback = function(err, result) {
      for(var i = 0; i < cashReceipts.get('length'); i++) {
        cashReceipts.objectAt(i).refresh();
      }
    }
    
    // set up
    dispatch = XT.Dispatch.create({
      className: 'XM.CashReceipt',
      functionName: 'post',
      parameters: [ids],
      target: that,
      action: callback
    });
    console.log("Post Cash Receipts: %@".fmt(ids));
    
    // do it
    cashReceipts.firstObject().get('store').dispatch(dispatch);
    return this;
  },
  
  /**
    Post all unposted cash receipts.

    @returns Receiver
  */
  postAll: function() {
    var that = this,qry, ary;
      
    // define the query
    qry = SC.Query.local(XM.CashReceipt, {
      conditions: "isPosted = NO AND isVoid = NO"
    });
    
    // execute it
    ary = XT.store.find(qry);
    
    // post when we get a result
    ary.addObserver('status', ary, function observer() {
      if (ary.get('status') === SC.Record.READY_CLEAN) {
        ary.removeObserver('status', ary, observer);
        XM.CashReceipt.post(ary);
      }
    })
  }

});



