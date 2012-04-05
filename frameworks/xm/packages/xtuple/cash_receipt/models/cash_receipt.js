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
  detailsLength: 0,
  
  /** @private */
  detailsLengthBinding: SC.Binding.from('*details.length').oneWay().noDelay(),
  
  /** @private */
  receivablesLength: 0,
  
  /** @private */
  receivablesLengthBinding: SC.Binding.from('*receivables.length').oneWay().noDelay(),
  
  // .................................................
  // CALCULATED PROPERTIES
  //
  
  receivables: function() {
    if (!this._xm_receivables) this._xm_receivables = [];
    var customer = this.get('customer'),
        isPosted = this.get('posted'),
        store = this.get('store');
        
    // get receivables according to situation   
    if (customer && isPosted === false) {
      if (!this._xm_query) {
        this._xm_query = SC.Query.local(XM.CashReceiptReceiavble, {
          conditions: "customer = {customer} AND isOpen = YES"
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

  //..................................................
  // OBSERVERS
  //
  
  customerDidChange: function() {
    if (this.get('customer')) this.customer.set('isEditable', false);
  }.observes('customer'),
  
  detailsLengthDidChange: function() {
    var details = this.get('details'),
        applications = this.get('applications');
    
    // process
    for (var i = 0; i < details.get('length'); i++) {
      var detail = details.objectAt(i),
          receivable = detail.get('receivable'),
          application = applications.findProperty('receivable', receivable);
          
      // if not found make one
      if (!application) {
        application = XM.CashReceiptApplication.create({
          cashReceiptDetail: detail,
          receivable: receivable
        });
        applications.pushObject(application);
        
      // if found, add detail if necessary
      } else if (!application.get('cashReceiptDetail')) {
        application.set('cashReceiptDetail', detail);
      }
    }
  }.observes('detailsLength').cacheable(),

  receivablesLengthDidChange: function() {
    var receivables = this.get('receivables'),
        applications = this.get('applications');
    
    // process
    for (var i = 0; i < receivables.get('length'); i++) {
      var receivable = receivables.objectAt(i),
          application = applications.findProperty('receivable', receivable);
          
      // if not found make one
      if (!application) {
        application = XM.CashReceiptApplication.create({
          cashReceiptDetail: detail,
          receivable: receivable
        });
        applications.pushObject(application);
      }
    }
  }.observes('receivablesLength').cacheable(),

});

XM.CashReceipt.mixin( /** @scope XM.CashReceipt */ {

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
  OTHER: 'O'

});

