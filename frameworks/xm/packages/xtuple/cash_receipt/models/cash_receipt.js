// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_cash_receipt');
sc_require('models/cash_receipt application');

/**
  @class

  @extends XM.Document
*/
XM.CashReceipt = XM.Document.extend(XM._CashReceipt,
  /** @scope XM.CashReceipt.prototype */ {

  numberPolicy: XT.AUTO_NUMBER,

  /** @private */
  detailLength: 0,
  
  /** @private */
  detailLengthBinding: SC.Binding.from('*detail.length').oneWay().noDelay(),
  
  /** @private */
  receivablesLength: 0,
  
  /** @private */
  receivablesLengthBinding: SC.Binding.from('*receivables.length').oneWay().noDelay(),
  
  // .................................................
  // CALCULATED PROPERTIES
  //
  
  receivables: function() {
    if (!this._xm_receviables) this._xm_receivables = [];
    var customer = this.get('customer'),
        isPosted = this.get('posted'),
        conditions, parameters;
        
    // build a query to get all the open receivables   
    if (customer && !isPosted) {
      var store = this.get('store');
      
      // define the query
      qry = SC.Query.local(XM.Receivable, {
        conditions: "customer = {customer} AND isOpen = YES",
        parameters: {
          customer: customer 
        }
      });
    
      // do it
      this._xm_receivables = store.find(qry);
    } else this._xm_receivables = [];
        
    return this._xm_receivables;
  }.property('customer'),
  
  /**
    @type SC.Array
  */
  applications: function() {
    if (!this._xm_applications) this._xm_applications = [];
    var receivables = this.get('receivables'),
        detail = this.get('detail');
    
    // process receivables
    for (var i = 0; i < receivables; i++) {
      var receivable = receivables.objectAt(i),
          application = this._xm_applications.findProperty('receivable', receivable);
          
      // if not found make one
      if (!application) {
        application = XM.CashReceiptApplication.create({
          receivable: receivable
        });
        this._xm_applications.pushObject(application);
      }
    }
    
    // process detail
    for (var i = 0; i < detail; i++) {
      var detail = detail.objectAt(i),
          receivable = detail.get('receivable'),
          application = this._xm_applications.findProperty('receivable', receivable);
          
      // if not found make one
      if (!application) {
        application = XM.CashReceiptApplication.create({
          cashReceiptDetail: detail,
          receivable: receivable
        });
        this._xm_applications.pushObject();
        
      // if found, add detail if necessary
      } else if (!application.get('cashReceiptDetail')) {
        application.set('cashReceiptDetail', detail);
      }
    }
  }.property('detailLength', 'receivablesLength'),
  
  //..................................................
  // METHODS
  //

  //..................................................
  // OBSERVERS
  //
  
  customerDidChange: function() {
    if (this.get('customer')) this.customer.set('isEditable', false);
  }.observes('customer')

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

