// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('xbos/__generated__/_invoice_line');
sc_require('xbos/xtuple/__core__/unit/models/unit');

/**
  @class

  @extends XM._InvoiceLine
*/
XM.InvoiceLine = XM._InvoiceLine.extend(
  /** @scope XM.InvoiceLine.prototype */ {
  
  /**
    An XM.Unit array of valid
  */
  sellingUnits: [],
  
  /**
    Tax detail
  */
  taxes: [],
  
  /** @private */
  taxesLength: 0,
  
  /** @private */
  taxesLengthBinding: SC.Binding.from('*taxes.length').noDelay(), 
  
  /**
    Tax Zone
  */
  taxZoneBinding: SC.Binding.from('*invoice.taxZone').noDelay(), 
  
  /** 
    Invoice date
  */
  invoiceDateBinding: SC.Binding.from('*invoice.invoiceDate').noDelay(), 
  
  /** 
    Invoice currency
  */
  currencyBinding: SC.Binding.from('*invoice.currency').noDelay(), 
  
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

  tax: function() {
    var taxes = this.get('taxes'), tax = 0;
    for(var i = 0; i < taxes.get('length'); i++) {
      tax = tax + taxes[i].get('tax');
    }
    return tax;
  }.property('taxesLength'),

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
  
  updatePrice: function() {
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

    // only update in legitimate editing states    
    if(status !== SC.Record.READY_NEW && 
       status !== SC.Record.READY_DIRTY) return;
       
    // if we have everything we need, get a price from the server
    if (customer && item && quantity &&
       quantityUnit && priceUnit && currency && effective) {
       
      // callback
      callback = function(err, result) {
        that.setIfChanged('price', result);
        that.setIfChanged('customerPrice', result);
      } 
     
      // function call
      XM.Customer.price(customer, shipto, item, quantity, quantityUnit, priceUnit, currency, effective, callback);
    }
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
  }.observes('item'),
  
  statusDidChange: function() {
    if(this.get('status') === SC.Record.READY_CLEAN) {
      this.item.set('isEditable', false);
      this.updateSellingUnits();
    }
  }.observes('status'),

  taxCriteriaDidChange: function() {
    var that = this;
    
      // callback
    callback = function(err, result) {
      var store = that.get('store'),
          taxes = [];

      for(var i = 0; i < result.get('length'); i++) {
        var storeKey, taxCode, detail,
            store = that.get('store');
        storeKey = store.loadRecord(XM.TaxCode, result[i].taxCode);
        taxCode = store.materializeRecord(storeKey);
        detail = SC.Object.create({ 
          taxCode: taxCode, 
          tax: result[i].tax 
        });
        taxes.push(detail);
      }
      that.setIfChanged('taxes', taxes);
    }
    
    if(status === SC.Record.READY_NEW || 
       status === SC.Record.READY_DIRTY) 
    {
      // request for calculated result
      var taxZone = that.getPath('invoice.taxZone.id'),
          taxType = that.getPath('taxType.id'),
          effective = that.getPath('invoice.invoiceDate').toFormattedString('%Y-%m-%d'),
          currency = that.getPath('invoice.currency.id'),
          amount = that.get('extendedPrice');
      XM.InvoiceLine.taxDetail(taxZone, taxType, effective, currency, amount, callback);
    
    // request for stored result
    } else XM.InvoiceLine.taxDetail(that.get('id'), callback);
  }.observes('status', 'extendedPrice', 'taxZone', 'taxType', 'invoiceDate', 'currency')

});

  /**
   Return the tax detail for line items based on input. 
   
   Signature for requesting estimated tax detail records
   XM.InvoiceLine.taxDetail(taxZoneId, taxTypeId, effective, currency, amount, callback)

   @param {Number} tax zone id - optional
   @param {Number} tax type id - optional
   @param {Number} currency id
   @param {Date} effective date
   @param {Number} amount
   @param {Function} callback
   
   Signature for requesting actual tax detail records
   XM.InvoiceLine.taxDetail(invoiceId, callback)
   
   @param {Number} invoice line id
   @param {Function} callback
   
   @returns Number 
  */
XM.InvoiceLine.taxDetail = function(taxZoneId, taxTypeId, effective, currency, amount, callback) {
  var that = this, dispatch, store = XM.store, params;
  if(typeof arguments[1] === 'function') {
    params = arguments[0];
    callback = arguments[1];
  }
  else params = [taxZoneId, taxTypeId, effective, currency, amount];
  
  // define call
  dispatch = XM.Dispatch.create({
    className: 'XM.InvoiceLine',
    functionName: 'taxDetail',
    parameters: params,
    target: that,
    action: callback
  });
  
  // do it
  store.dispatch(dispatch);
}

