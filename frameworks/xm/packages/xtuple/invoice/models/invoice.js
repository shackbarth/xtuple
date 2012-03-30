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
  
  /** @private */
  creditsLength: 0,
  
  /** @private */
  creditsLengthBinding: SC.Binding.from('*credits.length').oneWay().noDelay(),
  
  /** @private */
  linesLength: 0,
  
  /** @private */
  linesLengthBinding: SC.Binding.from('*lines.length').oneWay().noDelay(),
  
  /**
    Bound to ship charge, determines whether freight field is editable.
  
    @type Boolean
  */
  isCustomerPayFreight: true,
  
  /** @private */
  isCustomerPayFreightBinding: SC.Binding.from('*shipCharge.isCustomerPay').oneWay().noDelay(),
  
  /**
    Total credit allocated to the invoice.
    
    @type Number
  */
  allocatedCredit: 0,
  
  /**
    Outstanding credit.
    
    @type Number
  */
  outstandingCredit: 0,
  
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
    Total invoice taxes.
    
    @type Number
  */
  taxTotal: function() {
    var lineTax = this.get('lineTax'),
        freightTax = this.get('freightTax'),
        miscTax = this.get('miscTax');
    return SC.Math.round(lineTax + freightTax + miscTax, XT.MONEY_SCALE); 
  }.property('lineTax', 'freightTax', 'miscTax').cacheable(),
  
  /**
    Total invoice amount.
    
    @type Number
  */
  total: function() {
    var subTotal = this.get('subTotal'),
        freight = this.get('freight'),
        totalTax = this.get('taxTotal');
    return SC.Math.round(subTotal + freight + totalTax, XT.MONEY_SCALE); 
  }.property('subTotal', 'freight', 'taxTotal').cacheable(),
  
  //..................................................
  // METHODS
  //
  
  /**
    Copy the billto address to the shipto address.
  */
  copyToShipto: function() {
    this.setIfChanged('shiptoName', this.get('billtoName'));
    this.setIfChanged('shiptoPhone', this.get('billtoPhone'));
    this.setIfChanged('shiptoAddress1', this.get('billtoAddress1'));
    this.setIfChanged('shiptoAddress2', this.get('billtoAddress2'));
    this.setIfChanged('shiptoAddress3', this.get('billtoAddress3'));
    this.setIfChanged('shiptoCity', this.get('billtoCity')); 
    this.setIfChanged('shiptoState', this.get('billtoState'));
    this.setIfChanged('shiptoPostalCode', this.get('billtoPostalCode'));
    this.setIfChanged('shiptoCountry', this.get('billtoCountry'));
  },
  
  /**
    Destroy child records first.
  */
  destroy: function() {
    var lines = this.get('lines'),
        credits = this.get('credits'),
        recurrences = this.get('recurrences'),
        isPosted = this.get('isPosted');
        
    // Can't delete a posted invoice
    if (isPosted) return;
   
    // first destroy line items...
    for (var i = 0; i < lines.get('length'); i++) {
      lines.objectAt(i).destroy();
    }
    
    // destroy credits ...
    for (var i = 0; i < credits.get('length'); i++) {
      credits.objectAt(i).destroy();
    }
    
    // destroy recurrences
    for (var i = 0; i < recurrences.get('length'); i++) {
      recurrences.objectAt(i).destroy();
    }
      
    // now destroy the header
    arguments.callee.base.apply(this, arguments);
  },
  
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
  
  updateAllocatedCredit: function() {
    var credits = this.get('credits'),
        credit = 0;
    for(var i = 0; i < credits.get('length'); i++) {
      var status = credits.objectAt(i).get('status');
      if (status & SC.Record.DESTROYED > 0) {
        credit = credit + credits.objectAt(i).get('amount');
      }
    }
    this.setIfChanged('allocatedCredit', SC.Math.round(credit, XT.MONEY_SCALE));
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
          extendedPrice = status & SC.Record.DESTROYED > 0 ? line.get('extendedPrice') : 0;
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

      if (status & SC.Record.DESTROYED > 0) {
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
          rtax = SC.Math.round(codeTotal.get('tax'), XT.MONEY_SCALE);
      codeTotal.set('tax', rtax);
      taxTotal = taxTotal + rtax;
    }
    this.setIfChanged('lineTax',  SC.Math.round(taxTotal, XT.MONEY_SCALE));
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
      dispatch = XT.Dispatch.create({
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
    this.setIfChanged('miscTax', SC.Math.round(miscTax, XT.MONEY_SCALE));
  },

  //..................................................
  // OBSERVERS
  //
    
  validate: function() {
    var errors = arguments.callee.base.apply(this, arguments), 
        val, err;

    // validate Lines
    val = this.get('linesLength');
    err = XT.errors.findProperty('code', 'xt1010');
    this.updateErrors(err, !val);

    // validate Total
    val = this.get('total');
    err = XT.errors.findProperty('code', 'xt1009');
    this.updateErrors(err, val < 0);

    return errors;
  }.observes('linesLength', 'total'),
  
  creditsLengthDidChange: function() {
    this.updateAllocatedCredit();
  }.observes('creditsLength'),
  
  outstandingCreditCriteriaDidChange: function() {
    var customer = this.get('customer'),
        currency = this.get('currency'),
        invoiceDate = this.get('invoiceDate'),
        credit = this.get('credit'),
        that = this;
    
    // if we have everything we need and data has changed, 
    // get credit balance from the data source
    if (customer && currency && invoiceDate && credit &&
        (this._xm_cacheCust != customer ||
         this._xm_cacheCurr != currency ||
         this._xm_cacheDate != invoiceDate) ||
         this._xm_cacheCredit != credit) {
   
      // callback
      callback = function(err, result) {
        var credits = that.get('credits'),
            value = result;
            
        // account for unsaved changes
        for (var i = 0; i < credits.get('length'); i++) {
          var credit = credits.objectAt(i)
              status = credit.get('status'),
              amount = credit.get('amount');
          if (status == SC.Record.READY_NEW) value = value - amount;
          else if (status == SC.Record.DESTROYED_DIRTY) value = value + amount;
        }
        
        // update the value
        that.setIfChanged('outstandingCredit', value);
      }
     
      // function call
      XM.Customer.outstandingCredit(customer, currency, invoiceDate, callback);
      
      // cache variables to prevent redundant server calls
      this._xm_cacheCust = customer;
      this._xm_cacheCurr = currency;
      this._xm_cacheDate = invoiceDate,
      this._xm_cacheCredit = credit;
    }
  }.observes('customer', 'currency', 'invoiceDate', 'credit'),
  
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
      this.setIfChanged('shipVia', shipto.get('shipVia'));  
      this.setIfChanged('shiptoName', shipto.get('name'));
      this.setIfChanged('shiptoPhone', shipto.getPath('contact.phone'));
      if(address) {
        this.setIfChanged('shiptoAddress1', address.get('line1'));
        this.setIfChanged('shiptoAddress2', address.get('line2'));
        this.setIfChanged('shiptoAddress3', address.get('line3'));
        this.setIfChanged('shiptoCity', address.get('city')); 
        this.setIfChanged('shiptoState', address.get('state'));
        this.setIfChanged('shiptoPostalCode', address.get('postalCode'));
        this.setIfChanged('shiptoCountry', address.get('country'));
      }
    } else if(customer) {
      this.setIfChanged('salesRep', customer.get('salesRep'));
      this.setIfChanged('taxZone', customer.get('taxZone'));
      this.setIfChanged('currency', customer.get('currency'));
      this.setIfChanged('shipCharge', customer.get('shipCharge'));
    } else if(!shipto) {
      this.setIfChanged('shiptoName', '');
      this.setIfChanged('shiptoAddress1', '');
      this.setIfChanged('shiptoAddress2', '');
      this.setIfChanged('shiptoAddress3', '');
      this.setIfChanged('shiptoCity', ''); 
      this.setIfChanged('shiptoState', '');
      this.setIfChanged('shiptoPostalCode', '');
      this.setIfChanged('shiptoCountry', '');
      this.setIfChanged('shiptoPhone', '');
    }
    this.setFreeFormShiptoEnabled(isFreeFormShipto);
  }.observes('shipto'),
  
  isCustomerPayFreightDidChange: function() {
    this.freight.set('isEnabled', this.get('isCustomerPayFreight'));
  }.observes('isCustomerPayFreight'),

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
  dispatch = XT.Dispatch.create({
    className: 'XM.Invoice',
    functionName: 'post',
    parameters: invoice.get('id'),
    target: that,
    action: callback
  });
  invoice.get('store').dispatch(dispatch);
  return this;
}

