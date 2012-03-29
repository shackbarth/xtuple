// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_invoice');

/**
  @class

  @extends XM.Document
*/
XM.Invoice = XM.Document.extend(XM._Invoice, XM.Taxable,
  /** @scope XM.Invoice.prototype */ {
  
  numberPolicySetting: 'InvcNumberGeneration',
  
  /* @private */
  creditsLength: 0,
  
  /* @private */
  creditsLengthBinding: SC.Binding.from('*credits.length').noDelay(),
  
  /** @private */
  taxesLength: 0,
  
  /** @private */
  taxesLengthBinding: SC.Binding.from('*taxes.length').noDelay(),
  
  /* @private */
  linesLength: 0,
  
  /* @private */
  linesLengthBinding: SC.Binding.from('*lines.length').noDelay(),
  
  /**
    Total of line item sales.
    
    @type Number
  */
  subTotal: 0,
  
  /**
    Total of line item taxes. May be either estimated or actual
    depending on whether line item detail has changed.
    
    @type Number
  */
  lineTax: 0,
  
  /**
    An array of tax codes an with summarized amounts for line items.
    May be either estimated or actual depending on whether line item detail 
    has changed.
    
    @type Array
  */
  lineTaxDetail: [],
  
  /**
    Total of miscellaneous tax adjustments.
    
    @type Number
  */
  miscTax: 0,
  
  /**
    Calculated total of freight taxes. May be either estimated or actual
    depending on whether freight or tax zone has changed.
    
    @type Number
  */
  freightTax: 0,

  /**
    An array of tax codes an with amounts for freight. May be either
    estimated or actual. freightTaxes, if any, are always actual.
    
    @type Array
  */  
  freightTaxDetail: [],
  
  isPosted: SC.Record.attr(Boolean, {
    isEditable: false,
  }),
  
  // .................................................
  // CALCULATED PROPERTIES
  //
  
  /**
    Total credit allocated to the invoice.
    
    @type Number
  */
  credit: function() {
    var credits = this.get('credits'),
        credit = 0;
    for(var i = 0; i < credits.get('length'); i++) {
      credit = credit + credits.objectAt(i).get('amount');
    }
    return SC.Math.round(credit, XM.MONEY_SCALE);
  }.property('creditsLength').cacheable(),
  
  /**
    Total invoice taxes.
    
    @type Number
  */
  taxTotal: function() {
    var lineTax = this.get('lineTax'),
        freightTax = this.get('freightTax'),
        miscTax = this.get('miscTax');
    return SC.Math.round(lineTax + freightTax + miscTax, XM.MONEY_SCALE); 
  }.property('lineTax', 'freightTax', 'miscTax').cacheable(),
  
  /**
    Total invoice amount.
    
    @type Number
  */
  total: function() {
    var subTotal = this.get('subTotal'),
        freight = this.get('freight'),
        totalTax = this.get('taxTotal');
    return SC.Math.round(subTotal + freight + totalTax, XM.MONEY_SCALE); 
  }.property('subTotal', 'freight', 'taxTotal').cacheable(),
  
  //..................................................
  // METHODS
  //
  
  post: function() {
    return false;
  },
  
  void: function() {
    return false;
  },
  
  /**
    Set the enabled state of billto attributes.
    
    @param {Boolean) is editable
  */
  setFreeFormBilltoEnabled: function(isEditable) {
    this.billtoName.set('isEditable', isEditable);
    this.billtoPhone.set('isEditable', isEditable);
    this.billtoAddress1.set('isEditable', isEditable);
    this.billtoAddress2.set('isEditable', isEditable);
    this.billtoAddress3.set('isEditable', isEditable);
    this.billtoCity.set('isEditable', isEditable); 
    this.billtoState.set('isEditable', isEditable);
    this.billtoPostalCode.set('isEditable', isEditable);
    this.billtoCountry.set('isEditable', isEditable);
  },

  /**
    Set the enabled state of billto attributes.
    
    @param {Boolean) iseditable
  */  
  setFreeFormShiptoEnabled: function(isEditable) {
    this.shiptoName.set('isEditable', isEditable);
    this.shiptoPhone.set('isEditable', isEditable);
    this.shiptoAddress1.set('isEditable', isEditable);
    this.shiptoAddress2.set('isEditable', isEditable);
    this.shiptoAddress3.set('isEditable', isEditable);
    this.shiptoCity.set('isEditable', isEditable); 
    this.shiptoState.set('isEditable', isEditable);
    this.shiptoPostalCode.set('isEditable', isEditable);
    this.shiptoCountry.set('isEditable', isEditable);
  },
  
  /**
    Recalculate line item sales totals.
  */
  updateSubTotal: function() {
    var lines = this.get('lines'),
        subTotal = 0;
    for(var i = 0; i < lines.get('length'); i++) {
      var line = lines.objectAt(i),
          status = line.get('status'),
          extendedPrice = status & SC.Record.DESTROYED ? 0 : line.get('extendedPrice');
      subTotal = subTotal + extendedPrice;
    }
    this.setIfChanged('subTotal', subTotal);
  },
  
  /**
    Recalculate line item tax detail and totals.
  */
  updateLineTax: function() {
    var lines = this.get('lines'),
        taxDetail = [],
        taxTotal = 0;

    // first sub total taxes
    for (var i = 0; i < lines.get('length'); i++) {
      var line = lines.objectAt(i),
          taxes = line.get('taxDetail'),
          status = line.get('status');

      if (status & SC.Record.DESTROYED === false) {
        for (var n = 0; n < taxes.get('length'); n++) {
          var lineTax = taxes.objectAt(n),
              taxCode = lineTax.get('taxCode'),
              tax = lineTax.get('tax'),
              codeTotal = taxDetail.findProperty('taxCode', taxCode);

          // summarize by tax code 
          if(codeTotal) {
            codeTotal.set('tax', codeTotal.get('tax') + tax);
          } else {   
            codeTotal = SC.Object.create({
              taxCode: taxCode,
              tax: tax
            });
            taxDetail.push(codeTotal);
          }   
        }
      }
    }

    // next round and sum up each tax code for total
    for(var i = 0; i < taxDetail.get('length'); i++) {
      var codeTotal = taxDetail.objectAt(i),
          rtax = SC.Math.round(codeTotal.get('tax'), XM.MONEY_SCALE);
      codeTotal.set('tax', rtax);
      taxTotal = taxTotal + rtax;
    }
    this.setIfChanged('lineTax',  SC.Math.round(taxTotal, XM.MONEY_SCALE));
    this.setIfChanged('lineTaxDetail', taxDetail);
  },
  
  /**
    Recaclulate freight tax totals.
  */
  updateFreightTax: function(isEstimate) {  
    // request a calculated estimate for freight
    if(isEstimate) {
      var that = this,
          taxZone = that.getPath('taxZone.id') || -1,
          effective = that.getPath('invoiceDate').toFormattedString('%Y-%m-%d'),
          currency = that.getPath('currency.id'),
          amount = that.get('freight') || 0, dispatch,
          store = that.get('store');
          
      // callback
      callback = function(err, result) {
        this.setTaxDetail(result, 'freightTaxDetail', 'freightTax');
      }

      // define call
      dispatch = XM.Dispatch.create({
        className: 'XM.Invoice',
        functionName: 'calculateFreightTax',
        parameters: [taxZone, effective, currency, amount],
        target: that,
        action: callback
      });
      
      // do it
      store.dispatch(dispatch);
      
    // total up freight taxes recorded in the data source
    } else {
      var taxes = this.get('freightTaxes');
      this.setTaxDetail(taxes, 'freightTaxDetail', 'freightTax');
    }
  },
  
  /**
    Recaclulate tax adjustment total.
  */
  updateMiscTax: function() {  
    var taxes = this.get('adjustmentTaxes'),
        miscTax = 0;
    for(var i = 0; i < taxes.get('length'); i++) {
      var misc = taxes.objectAt(i),
          status = misc.get('status'),
          tax = status & SC.Record.DESTROYED ? 0 : misc.get('tax');
      miscTax = miscTax + taxes.objectAt(i).get('tax'); 
    } 
    this.setIfChanged('miscTax', SC.Math.round(miscTax, XM.MONEY_SCALE));
  },

  //..................................................
  // OBSERVERS
  //
    
  validate: function() {
    var errors = arguments.callee.base.apply(this, arguments), 
        val, err;

    // validate Lines
    val = this.get('linesLength');
    err = XM.errors.findProperty('code', 'xt1010');
    this.updateErrors(err, !val);

    // validate Total
    val = this.get('total');
    err = XM.errors.findProperty('code', 'xt1009');
    this.updateErrors(err, val < 0);

    return errors;
  }.observes('linesLength', 'total'),
  
  linesLengthDidChange: function() {
    // lock down currency if applicable
    this.currency.set('isEditable', this.get('linesLength') > 0);
    
    // handle line numbering
    var lines = this.get('lines'),
        max = 0, lineNumber, line;
    for (var i = 0; i < lines.get('length'); i++) {
      line = lines.objectAt(i);
      lineNumber = line.get('lineNumber');
      if (lineNumber) max = lineNumber > max ? lineNumber : max;
      else line.set('lineNumber', max + 1);
    }
  }.observes('linesLength'),
  
  /**
    Recalculate all line taxes.
  */
  lineTaxCriteriaDidChange: function() {
    // only recalculate if the user made a change 
    var status = this.get('status');
    if(status !== SC.Record.READY_NEW && 
       status !== SC.Record.READY_DIRTY) return
    
    // recalculate line tax
    var lines = this.get('lines'),
        store = this.get('store'),
        status = this.get('status');

    for (var i = 0; i < lines.get('length'); i++) {
      var line = lines.objectAt(i),
          lineStatus = line.get('status'),
          storeKey = line.get('storeKey');
      if (lineStatus === SC.Record.READY_CLEAN) {
        store.writeDataHash(storeKey, null, SC.Record.READY_DIRTY);
        line.recordDidChange('status');
      }
      line.taxCriteriaDidChange();
    }
  }.observes('taxZone', 'invoiceDate'),
  
  /**
    Recacalculate freight tax.
  */
  freightTaxCriteriaDidChange: function() {
    var status = this.get('status');
    if (status === SC.Record.READY_NEW || 
        status === SC.Record.READY_DIRTY) {
      this.updateFreightTax(true);
    }
  }.observes('freight', 'taxZone', 'invoiceDate'),
  
  /**
    Populates customer defaults when customer changes.
  */
  customerDidChange: function() {
    // only set defaults if the user made the change 
    var status = this.get('status');
    if(status !== SC.Record.READY_NEW && 
       status !== SC.Record.READY_DIRTY) return
       
    var customer = this.get('customer'),
        isFreeFormBillto = customer ? customer.get('isFreeFormBillto') : false;

    // pass defaults in
    this.setFreeFormBilltoEnabled(true);
    if(customer) {
      var address = customer.getPath('billingContact.address');
          
      // set defaults 
      this.setIfChanged('salesRep', customer.getPath('salesRep'));
      this.setIfChanged('commission', customer.get('commission'));
      this.setIfChanged('terms', customer.get('terms'));
      this.setIfChanged('taxZone', customer.get('taxZone'));
      this.setIfChanged('currency', customer.get('currency'));
      this.setIfChanged('shipCharge', customer.get('shipCharge'));
      this.setIfChanged('shipto', customer.get('shipto'));
      this.setIfChanged('shipVia', customer.get('shipVia'));     
      this.setIfChanged('billtoName', customer.get('name'));
      this.setIfChanged('billtoPhone', customer.getPath('billingContact.phone'));
      if(address) {
        this.setIfChanged('billtoAddress1', address.get('line1'));
        this.setIfChanged('billtoAddress2', address.get('line2'));
        this.setIfChanged('billtoAddress3', address.get('line3'));
        this.setIfChanged('billtoCity', address.get('city')); 
        this.setIfChanged('billtoState', address.get('state'));
        this.setIfChanged('billtoPostalCode', address.get('postalCode'));
        this.setIfChanged('billtoCountry', address.get('country'));
      }
    } else {
    
      // clear defaults
      this.setIfChanged('salesRep', null);
      this.setIfChanged('commission', 0);
      this.setIfChanged('terms', null);
      this.setIfChanged('taxZone', null);
      this.setIfChanged('shipto', null);
    } 
    this.setFreeFormBilltoEnabled(isFreeFormBillto);
  }.observes('customer'),
  
  /**
    Populates shipto defaults when shipto changes.
  */
  shiptoDidChange: function() {
    // only set defaults if the user made the change
    var status = this.get('status');    
    if(status !== SC.Record.READY_NEW && 
       status !== SC.Record.READY_DIRTY) return
       
    var shipto = this.get('shipto'),
        customer = this.get('customer'),
        isFreeFormShipto = customer ? customer.get('isFreeFormShipto') : false;

    // set defaults
    this.setFreeFormShiptoEnabled(true);
    if(shipto) {
      var address = shipto.get('address');
      this.setIfChanged('salesRep', shipto.get('salesRep'));
      this.setIfChanged('commission', shipto.get('commission'));
      this.setIfChanged('taxZone', shipto.get('taxZone'));
      this.setIfChanged('shipCharge', shipto.get('shipCharge'));
      this.setIfChange('shipVia', shipto.get('shipVia'));  
      this.setIfChange('shiptoName', shipto.get('name'));
      this.setIfChange('shiptoPhone', shipto.getPath('contact.phone'));
      if(address) {
        this.setIfChange('shiptoAddress1', address.get('line1'));
        this.setIfChange('shiptoAddress2', address.get('line2'));
        this.setIfChange('shiptoAddress3', address.get('line3'));
        this.setIfChange('shiptoCity', address.get('city')); 
        this.setIfChange('shiptoState', address.get('state'));
        this.setIfChange('shiptoPostalCode', address.get('postalCode'));
        this.setIfChange('shiptoCountry', address.get('country'));
      }
    } else if(customer) {
      this.setIfChange('salesRep', customer.get('salesRep'));
      this.setIfChange('taxZone', customer.get('taxZone'));
      this.setIfChange('currency', customer.get('currency'));
      this.setIfChange('shipCharge', customer.get('shipCharge'));
    } else if(!shipto) {
      this.setIfChange('shiptoName', '');
      this.setIfChange('shiptoAddress1', '');
      this.setIfChange('shiptoAddress2', '');
      this.setIfChange('shiptoAddress3', '');
      this.setIfChange('shiptoCity', ''); 
      this.setIfChange('shiptoState', '');
      this.setIfChange('shiptoPostalCode', '');
      this.setIfChange('shiptoCountry', '');
      this.setIfChange('shiptoPhone', '');
    }
    this.setFreeFormShiptoEnabled(isFreeFormShipto);
  }.observes('shipto'),

  /**
    Disable the customer if loaded from the database.
  */
  statusDidChange: function() {
    if(this.get('status') === SC.Record.READY_CLEAN) {
      this.customer.set('isEditable', false);
      this.updateSubTotal();
      this.updateFreightTax();
      this.updateMiscTax();
    }
  }.observes('status')

});

/**
  Post an invoice.
  
  @param {XM.Invoice} invoice
  @returns Number
*/
XM.Invoice.post = function(invoice, callback) { 
  if(!SC.kindOf(invoice, XM.Invoice) ||
     invoice.get('isPosted')) return false; 
  var that = this, dispatch;
  dispatch = XM.Dispatch.create({
    className: 'XM.Invoice',
    functionName: 'post',
    parameters: invoice.get('id'),
    target: that,
    action: callback
  });
  invoice.get('store').dispatch(dispatch);
  return this;
}

