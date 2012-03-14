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

  customerBinding: SC.Binding.from('.invoice.customer').noDelay(),
  
  currencyBinding: SC.Binding.from('.invoice.currency').noDelay(),
  
  sellingUnits: [],
  
  // .................................................
  // CALCULATED PROPERTIES
  //

  //..................................................
  // METHODS
  //

  init: function() {
    arguments.callee.base.apply(this, arguments) ;
    
    var item = this.get('item');
    
    if(item) this.itemDidChange();
  },

  //..................................................
  // OBSERVERS
  //
  
  itemDidChange: function() {
    var self = this,
        item = this.get('item');

    if(item) {
      callback = function(err, result) {
        var units = [], qry,
            store = self.get('store');

        qry = SC.Query.local(XM.Unit, {
          conditions: "guid CONTAINS {units}",
          parameters: { 
            units: result 
          }
        });
        
        units = store.find(qry);
        
        self.set('sellingUnits', units);
      }
      
      XM.Item.sellingUnits(item, callback);
    } else self.set('sellingUnits', []);
  }.observes('item'),
  
  quantityUnitDidChange: function() {
  }.observes('item', 'quantityUnit'),
  
  saleDidChange: function() {
    var ext = 0,
        item = this.get('item')
  }.observes('currency', 'item', 'billed', 'quantityUnit', 'priceUnit'),

});

