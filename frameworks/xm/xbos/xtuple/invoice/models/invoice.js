// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('xbos/__generated__/_invoice');
sc_require('mixins/document');

/**
  @class

  @extends XM._Invoice
  @extends XM.Document
*/
XM.Invoice = XM._Invoice.extend(XM.Document,
  /** @scope XM.Invoice.prototype */ {
  
  numberPolicySetting: 'InvcNumberGeneration',
  
  invoiceDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d',
    
    defaultValue: function() {
      return SC.DateTime.create();
    }
  }),
  
  orderDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d',
    
    defaultValue: function() {
      return SC.DateTime.create();
    }
  }),
  
  shipDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d',
    
    defaultValue: function() {
      return SC.DateTime.create();
    }
  }),
  
  currency: SC.Record.toOne('XM.Currency', {
    defaultValue: function() {
      return XM.Currency.BASE;
    }
  }),

  isPrinted: SC.Record.attr(Boolean, {
    defaultValue: false  
  }),

  isPosted: SC.Record.attr(Boolean, {
    defaultValue: false  
  }),

  freeFormBillto: false,
  
  freeFormShipto: false,
  
  /* @private */
  creditsLength: 0,
  
  /* @private */
  creditsLengthBinding: SC.Binding.from('.credits.length').noDelay(),
  
  /** @private */
  taxesLength: 0,
  
  /** @private */
  taxesLengthBinding: SC.Binding.from('.taxes.length').noDelay(),
  
  /* @private */
  linesLength: 0,
  
  /* @private */
  linesLengthBinding: SC.Binding.from('.lines.length').noDelay(),
  
  subTotal: 0,
  
  lineTax: 0,
  
  freightTax: 0,
  
  miscTax: 0,
  
  /**
    An array of tax codes an with summarized amounts for line items.
  */
  lineTaxDetail: [],

  /**
    An array of tax codes an with amounts for freight.
  */  
  freightTaxDetail: [],

  /**
    An array of tax codes an with amounts for line items.
  */
  miscTaxDetail: [],
  
  // .................................................
  // CALCULATED PROPERTIES
  //
  
  /**
    Credit allocated to the invoice.
  */
  credit: function() {
    var credits = this.get('credits'),
        credit = 0;
    
    for(var i = 0; i < credits.get('length'); i++) {
      credit = credit + credits.objectAt(i).get('amount');
    }
    
    return credit;
  }.property('creditsLength').cacheable(),
  
  totalTax: function() {
    var lineTax = this.get('lineTax'),
        freightTax = this.get('freightTax'),
        miscTax = this.get('miscTax');
        
    return lineTax + freightTax + miscTax; 
  }.property('lineTax', 'freightTax', 'miscTax').cacheable(),
  
  total: function() {
    var subTotal = this.get('subTotal'),
        freight = this.get('freight'),
        totalTax = this.get('totalTax');

    return subTotal + freight + totalTax; 
  }.property('subTotal', 'freight', 'totalTax').cacheable(),
  
  //..................................................
  // METHODS
  //
  
  post: function() {
    return false;
  },
  
  void: function() {
    return false;
  },

  //..................................................
  // OBSERVERS
  //
  
  validate: function() {
    var errors = this.get('validateErrors'), val, err;

    // Validate Number
    val = this.get('number') ? this.get('number').length : 0;
    err = XM.errors.findProperty('code', 'xt1001');
    this.updateErrors(err, !val);

    // Validate Invoice Date
    val = this.get('invoiceDate');
    err = XM.errors.findProperty('code', 'xt1012');
    this.updateErrors(err, !val);
    
    // Validate Customer
    val = this.get('customer');
    err = XM.errors.findProperty('code', 'xt1011');
    this.updateErrors(err, !val);

    // Validate Currency
    val = this.get('currency');
    err = XM.errors.findProperty('code', 'xt1014');
    this.updateErrors(err, !val);

    // Validate Terms
    val = this.get('terms');
    err = XM.errors.findProperty('code', 'xt1013');
    this.updateErrors(err, !val);

    // Validate Commission
    val = this.get('commission');
    err = XM.errors.findProperty('code', 'xt1016');
    this.updateErrors(err, isNaN(val));

    // Validate Lines
    val = this.get('linesLength');
    err = XM.errors.findProperty('code', 'xt1010');
    this.updateErrors(err, !val);

    // Validate Freight
    val = this.get('freight');
    err = XM.errors.findProperty('code', 'xt1015');
    this.updateErrors(err, isNaN(val));

    // Validate Total
    val = this.get('total');
    err = XM.errors.findProperty('code', 'xt1009');
    this.updateErrors(err, val < 0);

    return errors;
  }.observes('invoiceDate', 'number', 'customer', 'term', 'commission', 'currency', 'linesLength', 'freight', 'total'),
  
  /**
    Populates customer defaults when customer changes.
  */
  customerDidChange: function() {
    var customer = this.get('customer'),
        status = this.get('status');

    this.set('isFreeFormBillto', customer.get('isFreeFormBillto'));
    this.set('isFreeFormShipto', customer.get('isFreeFormShipto'));
    
    // pass defaults in
    if(status === SC.Record.READY_NEW) {
      if(customer) {
        var address = customer.getPath('billingContact.address');
  
        this.set('salesRep', customer.getPath('salesRep'));
        this.set('commission', customer.get('commission') * 100);
        this.set('terms', customer.get('terms'));
        this.set('taxZone', customer.get('taxZone'));
        this.set('currency', customer.get('currency'));
        this.set('shipCharge', customer.get('shipCharge'));
        this.set('shipto', customer.get('shipto'));
        this.set('billtoName', customer.get('name'));
        this.set('billtoPhone', customer.getPath('billingContact.phone'));
        
        if(address) {
          this.set('billtoAddress1', address.get('line1'));
          this.set('billtoAddress2', address.get('line2'));
          this.set('billtoAddress3', address.get('line3'));
          this.set('billtoCity', address.get('city')); 
          this.set('billtoState', address.get('state'));
          this.set('billtoPostalCode', address.get('postalCode'));
          this.set('billtoCountry', address.get('country'));  
        }
      } else {
        this.set('salesRep', null);
        this.set('commission', 0);
        this.set('terms', null);
        this.set('taxZone', null);
        this.set('currency', null);
        this.set('shipCharge', null);
        this.set('shipto', null);
        this.set('billtoName', '');
        this.set('billtoPhone', '');
        this.set('billtoAddress1','');
        this.set('billtoAddress2', '');
        this.set('billtoAddress3', '');
        this.set('billtoCity', ''); 
        this.set('billtoState', '');
        this.set('billtoPostalCode', '');
        this.set('billtoCountry', '');
        this.set('billtoPhone', '');
      }
        
    // can not change customer after committing
    } else if (status & SC.Record.READY) {
      this.set('customer', this._attrCache.get('customer'));
    }
  }.observes('customer'),
  
  /**
    Populates shipto defaults when shipto changes.
  */
  shiptoDidChange: function() {
    var shipto = this.get('shipto'),
        customer = this.get('customer');
    
    if(status & SC.Record.READY) {
      if(shipto) {
        var address = shipto.get('address');
       
        this.set('salesRep', shipto.get('salesRep'));
        this.set('commission', shipto.get('commission') * 100);
        this.set('taxZone', shipto.get('taxZone'));
        this.set('shipCharge', shipto.get('shipCharge'));
        this.set('shiptoName', shipto.get('name'));
        this.set('shiptoPhone', shipto.getPath('contact.phone'));
        
        if(address) {
          this.set('shiptoAddress1', address.get('line1'));
          this.set('shiptoAddress2', address.get('line2'));
          this.set('shiptoAddress3', address.get('line3'));
          this.set('shiptoCity', address.get('city')); 
          this.set('shiptoState', address.get('state'));
          this.set('shiptoPostalCode', address.get('postalCode'));
          this.set('shiptoCountry', address.get('country'));
        }
        
      } else if(customer) {
        this.set('salesRep', customer.get('salesRep'));
        this.set('taxZone', customer.get('taxZone'));
        this.set('currency', customer.get('currency'));
        this.set('shipCharge', customer.get('shipCharge'));
      } else {
        this.set('salesRep', null);
        this.set('commission', 0);
        this.set('taxZone', null);
        this.set('shipCharge', null);
      }  
      
      if(!shipto) {
        this.set('shiptoName', '');
        this.set('shiptoAddress1', '');
        this.set('shiptoAddress2', '');
        this.set('shiptoAddress3', '');
        this.set('shiptoCity', ''); 
        this.set('shiptoState', '');
        this.set('shiptoPostalCode', '');
        this.set('shiptoCountry', '');
        this.set('shiptoPhone', '');
      }
    }
  }.observes('shipto'),
  
  /**
    Recalculate line item tax and sales totals.
  */
  linesDidChange: function() {
    var lines = this.get('lines'),
        taxDetail = [],
        taxTotal = 0, subTotal = 0;

    // first sub total sales and taxes
    for(var i = 0; i < lines.get('length'); i++) {
      var line = lines.objectAt(i),
          taxes = line.get('taxes'),
          billed = line.get('billed'),
          qtyUnitRatio = line.get('quantityUnitRatio'),
          price = line.get('price'),
          priceUnitRatio = line.get('priceUnitRatio');

      // line sub total
      subTotal = subTotal + SC.Math.round(billed * qtyUnitRatio * (price / priceUnitRatio), 2);

      // taxes
      for(var n = 0; n < taxes.get('length'); n++) {
        var lineTax = taxes.objectAt(n),
            taxCode = lineTax.get('taxCode'),
            tax = lineTax.get('tax') - 0,
            codeTotal = taxDetail.findProperty('taxCode', taxCode);
        
        // summarize by tax code 
        if(codeTotal) {
          codeTotal.tax = codeTotal.tax + tax;
        } else {
          codeTotal = {};
    
          codeTotal.taxCode = taxCode;
          codeTotal.tax = tax;
          taxDetail.push(codeTotal);
        }   
      }
    }
    
    this.set('subTotal', subTotal);
    
    // next round and sum up each tax code total
    for(var i = 0; i < taxDetail.length; i++) {
      var codeTotal = taxDetail.objectAt(i);
      
      codeTotal.tax = SC.Math.round(codeTotal.tax, XM.MONEY_SCALE);
      taxTotal = taxTotal + codeTotal.tax;
    }
    
    this.set('lineTax', taxTotal);
    this.set('lineTaxDetail', taxDetail);
  }.observes('linesLength', 'taxZone'),
  
  taxesDidChange: function() {    
    var taxes = this.get('taxes'), 
        miscTaxDetail = [], freightTaxDetail = [],
        miscTax = 0, freightTax = 0;

    // Loop through header taxes and allocate
    for(var i = 0; i < taxes.get('length'); i++) {
      var hist = taxes.objectAt(i),
          type = hist.getPath('taxType.id'),
          tax = SC.Math.round(hist.get('tax'), XM.MONEY_SCALE),
          taxCode = hist.get('taxCode'),
          codeTax = {};

      if(type === XM.TaxType.ADJUSTMENT) {
        miscTax = miscTax + tax;
    
        codeTax.taxCode = taxCode;
        codeTax.tax = tax;
        miscTaxDetail.push(codeTax); 
  
      } else if (type === XM.TaxType.FREIGHT) {
        freightTax = freightTax + tax;
        
        codeTax.taxCode = taxCode;
        codeTax.tax = tax;
        freightTaxDetail.push(codeTax); 
      }
    }
    
    this.set('miscTax', miscTax);
    this.set('miscTaxDetail', miscTaxDetail);
    this.set('freightTax', freightTax);
    this.set('freightTaxDetail', freightTaxDetail);
  }.observes('taxesLength', 'taxZone'),
  
  isPostedDidChange: function() {
    var status = this.get('status');
    
    // can not change this directly
    if(status === SC.Record.READY_NEW) this.set('isPosted', false);
    else if(status & SC.Record.READY) this.set('isPosted', this._attrCache.get('isPosted'));
  }.observes('isPosted')

});

