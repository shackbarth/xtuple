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
    Inovice Customer
  */
 // customerBinding: SC.Binding.from('*invoice.customer').noDelay(), 
    
  /** 
    Invoice currency
  */
 // currencyBinding: SC.Binding.from('*invoice.currency').noDelay(), 

  /** 
    Invoice date
  */
  invoiceDateBinding: SC.Binding.from('*invoice.invoiceDate').noDelay(), 

  invoice: SC.Record.toOne('XM.Invoice', {
    defaultValue: function() {
      return arguments[0] ? arguments[0].get('parentRecord') : null;
    }
  }),
  
  /**
    An XM.Unit array of valid
  */
  sellingUnits: [],
  
  /** 
    Invoice currency
  */
 // shiptoBinding: SC.Binding.from('*invoice.shipto').noDelay(), 
  
  taxTotal: 0,
  
  /**
    Tax detail
  */
  taxDetail: [],
  
  /** @private */
  taxesLength: 0,
  
  /** @private */
//  taxesLengthBinding: SC.Binding.from('*taxes.length').noDelay(), 
  
  /**
    Tax Zone
  */
 // taxZoneBinding: SC.Binding.from('*invoice.taxZone').noDelay(), 
  
  // .................................................
  // CALCULATED PROPERTIES
  //

  extendedPrice: function() {
    var billed = this.get('billed') || 0,
        qtyUnitRatio = this.get('quantityUnitRatio') || 1,
        price = this.get('price') || 0,
        priceUnitRatio = this.get('priceUnitRatio') || 1;
    return SC.Math.round(billed * qtyUnitRatio * (price / priceUnitRatio), 2);
  },//.property('billed', 'price').cacheable(),

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
  },//.observes('extendedPrice'),

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
  },//.observes('customer','shipto','billed','quantity','quantityUnit','priceUnit','invoiceDate','currency'),

  taxCriteriaDidChange: function() {
    var that = this,
        status = that.get('status'),
        taxDetail;
   debugger
console.log('1')
    if(status == SC.Record.READY_NEW || 
       status == SC.Record.READY_DIRTY) 
    {
      // request a calculated estimate
console.log('not here')      
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
        that.setIfChanged('taxDetail', taxDetail);
      }
    
      // request for calculated result
      var taxZone = that.getPath('invoice.taxZone.id'),
          taxType = that.getPath('taxType.id'),
          effective = that.getPath('invoice.invoiceDate').toFormattedString('%Y-%m-%d'),
          currency = that.getPath('invoice.currency.id'),
          amount = that.get('extendedPrice');
      XM.InvoiceLine.taxDetail(taxZone, taxType, effective, currency, amount, callback);
    } else {
console.log('2')
      // add up stored result
      var taxes = this.get('taxes'),
          taxDetail = [],
          taxTotal = 0;
console.log('3')
      // Loop through header taxes and allocate
      for(var i = 0; i < taxes.get('length'); i++) {
        var hist = taxes.objectAt(i),
            tax = hist.get('tax'),
            taxCode = hist.get('taxCode'),
            codeTax = {};
console.log('4', tax)
        taxTotal = taxTotal + tax;
    console.log('5', taxTotal)
        codeTax.taxCode = taxCode;
  console.log('6')
        codeTax.tax = tax;
  console.log('7')
        taxDetail.push(codeTax);  
console.log('8')
      }    
      this.set('taxDetail', taxDetail);
      this.set('taxTotal', taxTotal);
    }
    console.log('30')
  },//.observes('status', 'extendedPrice', 'taxZone', 'taxType', 'invoiceDate', 'currency'),

});

/**
  Return the estimated tax detail for line items based on input. 

  @param {Number} tax zone id - optional
  @param {Number} tax type id - optional
  @param {Number} currency id
  @param {Date} effective date
  @param {Number} amount
  @param {Function} callback
  @returns Number 
*/
XM.InvoiceLine.taxDetail = function(taxZoneId, taxTypeId, effective, currency, amount, callback) {
  var that = this, dispatch, store = XM.store, params;
  
  // define call
  dispatch = XM.Dispatch.create({
    className: 'XM.InvoiceLine',
    functionName: 'taxDetail',
    parameters: [taxZoneId, taxTypeId, effective, currency, amount],
    target: that,
    action: callback
  });
  
  // do it
  store.dispatch(dispatch);
}

