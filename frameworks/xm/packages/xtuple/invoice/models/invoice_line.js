// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_invoice_line');

/**
  @class

  @extends XM.Record
*/
XM.InvoiceLine = XM.Record.extend(XM._InvoiceLine,
  /** @scope XM.InvoiceLine.prototype */ {

  /** 
    Inovice customer
  */
  customerBinding: SC.Binding.from('*invoice.customer').noDelay(), 
    
  /** 
    Invoice currency
  */
  currencyBinding: SC.Binding.from('*invoice.currency').noDelay(), 

  /** 
    Invoice date
  */
  invoiceDateBinding: SC.Binding.from('*invoice.invoiceDate').noDelay(), 
  
  /**
    Invoice tax zone
  */
  taxZoneBinding: SC.Binding.from('*invoice.taxZone').noDelay(), 
  
  /** 
    Invoice shipto
  */
  shiptoBinding: SC.Binding.from('*invoice.shipto').noDelay(), 
  
  /**
    An XM.Unit array of valid
  */
  sellingUnits: [],
  
  /** @private */
  taxesLength: 0,
  
  /** @private */
  taxesLengthBinding: SC.Binding.from('*taxes.length').noDelay(), 
  
  taxDetail: [],
  
  /** private */
  taxDetailLength: 0,
  
  /** private */
  taxDetailLengthBinding: SC.Binding.from('*taxDetail.length').noDelay(),
  
  // .................................................
  // CALCULATED PROPERTIES
  //

  extendedPrice: function() {
    var billed = this.get('billed') || 0,
        qtyUnitRatio = this.get('quantityUnitRatio') || 1,
        price = this.get('price') || 0,
        priceUnitRatio = this.get('priceUnitRatio') || 1;
    return SC.Math.round(billed * qtyUnitRatio * (price / priceUnitRatio), 2);
  }.property('billed', 'price').cacheable(),
  
  taxTotal: function() {
    var taxDetail = this.get('taxDetail'),
        taxTotal = 0;
    for(var i = 0; i < taxDetail.length; i++) {
      taxTotal = taxTotal + taxDetail[i].get('tax');
    }
    return taxTotal;
  }.property('taxDetailLength').cacheable(),

  //..................................................
  // METHODS
  //

  updateSellingUnits: function() {
    var that = this,
        item = that.get('item');
    if(item) {
  
      // callback
      callback = function(err, result) {
        var units = [], qry,
            store = that.get('store');
        qry = SC.Query.local(XM.Unit, {
          conditions: "guid ANY {units}",
          parameters: { 
            units: result.units
          }
        });
        units = store.find(qry);
        that.setIfChanged('sellingUnits', units);
      }
      
      // function call 
      XM.Item.sellingUnits(item, callback);
    } else that.setIfChanged('sellingUnits', []);
  },

  //..................................................
  // OBSERVERS
  //

  extendendPriceDidChange: function() {
    var invoice = this.get('invoice');
    if (invoice) invoice.linesDidChange();
  }.observes('extendedPrice'),

  itemDidChange: function() {
    this.updateSellingUnits();
    this.updatePrice();
  },//.observes('item'),
  
  statusDidChange: function() {
    if(this.get('status') === SC.Record.READY_CLEAN) {
      this.item.set('isEditable', false);
      this.updateSellingUnits();
    }
  },//.observes('status'),

  priceCriteriaDidChange: function() {
    // only update in legitimate editing states    
    if(status !== SC.Record.READY_NEW && 
       status !== SC.Record.READY_DIRTY) return;
    var that = this,
        customer = this.getPath('invoice.customer'),
        shipto = this.getPath('invoice.shipto'),
        item = this.get('item'),
        quantity = this.get('billed'),
        quantityUnit = this.get('quantityUnit'),
        priceUnit = this.get('priceUnit'),
        currency = this.getPath('invoice.currency'),
        effective = this.getPath('invoice.invoiceDate'),
        status = this.get('status');
       
    // if we have everything we need, get a price from the server
    if (customer && item && quantity &&
       quantityUnit && priceUnit && currency && effective) {
       
      // callback
      callback = function(err, result) {
        that.setIfChanged('price', result);
        that.setIfChanged('customerPrice', result);
      } 
     
      // function call
      customer.price(shipto, item, quantity, quantityUnit, priceUnit, currency, effective, callback);
    }
  }.observes('customer','shipto','billed','quantity','quantityUnit','priceUnit','invoiceDate','currency'),

  taxCriteriaDidChange: function() {
    var that = this,
        status = that.get('status'),
        taxDetail = [];
    if(status == SC.Record.READY_NEW || 
       status == SC.Record.READY_DIRTY) 
    {
      // request a calculated estimate 
      var taxZone = that.getPath('invoice.taxZone.id'),
          taxType = that.getPath('taxType.id'),
          effective = that.getPath('invoice.invoiceDate').toFormattedString('%Y-%m-%d'),
          currency = that.getPath('invoice.currency.id'),
          amount = that.get('extendedPrice'), dispatch,
          store = that.get('store');
             
      // callback
      callback = function(err, result) {
        var store = that.get('store');
        for(var i = 0; i < result.get('length'); i++) {
          var storeKey, taxCode, detail,
              store = that.get('store');
          storeKey = store.loadRecord(XM.TaxCode, result[i].taxCode);
          taxCode = store.materializeRecord(storeKey);
          detail = SC.Object.create({ 
            taxCode: taxCode, 
            tax: result[i].tax 
          });
          taxDetail.push(detail);
        }
        that.setIfChanged('taxDetail', taxDetail);
      }

      // define call
      dispatch = XM.Dispatch.create({
        className: 'XM.InvoiceLine',
        functionName: 'calculateTax',
        parameters: [taxZone, taxType, effective, currency, amount],
        target: that,
        action: callback
      });
      
      // do it
      store.dispatch(dispatch);
    } else {
      // add up stored result
      var taxes = this.get('taxes');

      // Loop through header taxes and allocate
      for(var i = 0; i < taxes.get('length'); i++) {
        var hist = taxes.objectAt(i),
            tax = hist.get('tax'),
            taxCode = hist.get('taxCode'),
            codeTax = {};
        codeTax.taxCode = taxCode;
        codeTax.tax = tax;
        taxDetail.push(codeTax);  
      }    
      this.setIfChanged('taxDetail', taxDetail);
    }
  }//.observes('status', 'extendedPrice', 'taxZone', 'taxType', 'invoiceDate', 'currency'),

});
