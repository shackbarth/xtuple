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
  
  /** @private */
  taxesLength: 0,
  
  /** @private */
  taxesLengthBinding: SC.Binding.from('*taxes.length').noDelay(), 
  
  
  // .................................................
  // CALCULATED PROPERTIES
  //
  
  extendedPrice: function() {
    var billed = this.get('billed'),
        qtyUnitRatio = this.get('quantityUnitRatio'),
        price = this.get('price'),
        priceUnitRatio = this.get('priceUnitRatio');
    return SC.Math.round(billed * qtyUnitRatio * (price / priceUnitRatio), 2);
  }.property('billed', 'price').cacheable(),
  
  tax: function() {
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
        that.set('sellingUnits', units);
      }
      
      // function call 
      XM.Item.sellingUnits(item, callback);
    } else that.set('sellingUnits', []);
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
        that.set('price', result);
        that.set('customerPrice', result);
      } 
     
      // function call
      XM.Customer.price(customer, shipto, item, quantity, quantityUnit, priceUnit, currency, effective, callback);
    }
  },

  //..................................................
  // OBSERVERS
  //

  extendendPrice: function() {
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
  }.observes('status')

});

