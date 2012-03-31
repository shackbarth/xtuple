// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_invoice_line');

/**
  @class

  @extends XT.Record
*/
XM.InvoiceLine = XT.Record.extend(XM._InvoiceLine, XM.Taxable,
  /** @scope XM.InvoiceLine.prototype */ {
  
  /**
    An XM.Unit array of valid
  */
  sellingUnits: [],
  
  tax: 0,
  
  /** @private */
  taxesLength: 0,
  
  /** @private */
  taxesLengthBinding: SC.Binding.from('*taxes.length').oneWay().noDelay(), 
  
  taxDetail: [],
  
  /** @private */
  taxDetailLength: 0,
  
  /** @private */
  taxDetailLengthBinding: SC.Binding.from('*taxDetail.length').oneWay().noDelay(),
  
  /**
    Flag whether an actual item is used, or a miscellaneous description.  
  */
  isItem: true,
  
  /**
    @type XM.ItemInfo
  */
  item: SC.Record.toOne('XM.ItemInfo', {
    isNested: true,
    label: '_item'.loc(),
    isRequired: true,
    isEditable: true
  }),

  /**
    @type String
  */
  itemNumber: SC.Record.attr(String, {
    label: '_itemNumber'.loc(),
    isEditable: false,
  }),

  /**
    @type String
  */
  description: SC.Record.attr(String, {
    label: '_description'.loc(),
    isEditable: false,
  }),

  /**
    @type XM.SalesCategory
  */
  salesCategory: SC.Record.toOne('XM.SalesCategory', {
    label: '_salesCategory'.loc(),
    isEditable: false
  }),
  
  // .................................................
  // CALCULATED PROPERTIES
  //

  extendedPrice: function() {
    var billed = this.get('billed') || 0,
        qtyUnitRatio = this.get('quantityUnitRatio') || 1,
        price = this.get('price') || 0,
        priceUnitRatio = this.get('priceUnitRatio') || 1;
    return SC.Math.round(billed * qtyUnitRatio * (price / priceUnitRatio), XT.MONEY_SCALE);
  }.property('billed', 'price').cacheable(),

  //..................................................
  // METHODS
  //

  updateSellingUnits: function() {
    var that = this,
        item = that.get('item'),
        isItem = that.get('isItem');
        
    // request selling units from the server if we can
    if(isItem && item) {
  
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
    } else {
      this.setIfChanged('quantityUnit', null);
      this.setIfChanged('priceUnit', null);
      this.setIfChanged('sellingUnits', []);
    }
  },

  //..................................................
  // OBSERVERS
  //

  validate: function() {
    return arguments.callee.base.apply(this, arguments); 
  }.observes('item', 'itemNumber', 'itemDescription', 'salesCategory'),

  isItemDidChange: function() {
    var isItem = this.get('isItem'),
        isPosted = this.getPath('invoice.isPosted'),
        item = this.get('item');
        
    // clear unused fields
    if (isItem) {
      this.setIfChanged('itemNumber', '');
      this.setIfChanged('description', '');
      this.setIfChanged('salesCategory', -1);
      if (item && item.get('id') == -1) {
        this.set('item', null);
      }
    } else {
      this.setIfChanged('item', XM.ItemInfo.none());
      this.setIfChanged('quantityUnit', null);
      this.setIfChanged('priceUnit', null);
      this.setIfChanged('sellingUnits', []);
      this.setIfChanged('customerPrice', 0);
    }
    
    // item related settings
    this.item.set('isRequired', isItem);
    this.item.set('isEditable', isItem && !isPosted);
    this.quantityUnit.set('isRequired', isItem);
    this.priceUnit.set('isRequired', isItem);
    
    // misc related settings
    this.itemNumber.set('isRequired', !isItem);
    this.itemNumber.set('isEditable', !isItem && !isPosted); 
    this.description.set('isRequired', !isItem);
    this.description.set('isEditable', !isItem && !isPosted);
    this.salesCategory.set('isRequired', !isItem);
    this.salesCategory.set('isEditable', !isItem && !isPosted);
  }.observes('isItem'),

  extendedPriceDidChange: function() {
    var invoice = this.get('invoice');
    if (invoice) invoice.updateSubTotal();
  }.observes('extendedPrice'),

  itemDidChange: function() {
    var item = this.get('item'),
        isItem = this.get('isItem');
    this.updateSellingUnits();
    if (isItem && item) {
      this.setIfChanged('quantityUnit', item.get('inventoryUnit'));
      this.setIfChanged('priceUnit', item.get('priceUnit'));
    }
  }.observes('item'),

  statusDidChange: function() {
    var status = this.get('status');
    if(status === SC.Record.READY_CLEAN) {
      this.updateSellingUnits();
      this.taxCriteriaDidChange();
    } else if (status & SC.Record.DESTROYED) {
      this.extendedPriceDidChange();
      this.taxDidChange();
    }
  }.observes('status'),

  /**
    If the quantity unit of measure is not the item's inventory unit of measure, 
    then the price unit of measure is forced to be the inventory unit of measure 
    and disabled. Update the unit of measure ratio if applicable.
  */
  quantityUnitDidChange: function() {
    var isItem = this.get('isItem'),
        item = this.get('item'),
        quantityUnit = this.get('quantityUnit'),
        inventoryUnit = item.get('inventoryUnit'),
        isChanged = quantityUnit !== inventoryUnit,
        that = this;
    if(isItem && item && this.isDirty()) {
      if (isChanged) {
        // set the price unit equal to the quantity unit
        this.setIfChanged('priceUnit', quantityUnit); 
        
        // get the unit of measure conversion from the data source
        callback = function(err, result) {
          that.setIfChanged('quantityUnitRatio', result);
        }
    
        // function call
        XM.Item.unitToUnitRatio(item, quantityUnit, inventoryUnit, callback);
      } else {
        this.setIfChanged('quantityUnitRatio', 1);
      }
    }
    this.priceUnit.set('isEditable', !isChanged);
  }.observes('quantityUnit'),
  
  /**
    Update the unit of measure ratio if applicable.
  */
  priceUnitDidChange: function() {
    var isItem = this.get('isItem'),
        item = this.get('item'),
        priceUnit = this.get('priceUnit'),
        inventoryUnit = item.get('inventoryUnit'),
        isChanged = priceUnit !== inventoryUnit,
        that = this;
    if(isItem && item && this.isDirty()) {
      if (isChanged) {
        // get the unit of measure conversion from the data source
        callback = function(err, result) {
          that.setIfChanged('priceUnitRatio', result);
        }
    
        // function call
        XM.Item.unitToUnitRatio(item, priceUnit, inventoryUnit, callback);
      } else {
        this.setIfChanged('priceUnitRatio', 1);
      }
    }
  }.observes('priceUnit'),

  priceCriteriaDidChange: function() {;    
    if (this.isNotDirty()) return;
     
    // recalculate price
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

    // if we have everything we need, get a price from the data source
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
  }.observes('item', 'billed','quantity','quantityUnit','priceUnit'),

  /**
    Recalculate tax.
  */
  taxCriteriaDidChange: function() {
    var that = this,
        taxTotal = 0, taxDetail = [];

    if (this.isDirty()) {
      // request a calculated estimate 
      var taxZone = that.getPath('invoice.taxZone.id'),
          taxType = that.getPath('taxType.id'),
          effective = that.getPath('invoice.invoiceDate').toFormattedString('%Y-%m-%d'),
          currency = that.getPath('invoice.currency.id'),
          amount = that.get('extendedPrice'), dispatch,
          store = that.get('store');

      taxZone = taxZone ? taxZone : -1;
      taxType = taxType ? taxType : -1;
      
      // callback
      callback = function(err, result) {
        that.setTaxDetail(result, 'taxDetail', 'tax');
      }

      // define call
      dispatch = XT.Dispatch.create({
        className: 'XM.InvoiceLine',
        functionName: 'calculateTax',
        parameters: [taxZone, taxType, effective, currency, amount],
        target: that,
        action: callback
      });
      
      // do it
      console.log("XM.InvoiceTax for: %@".fmt(this.get('id')));
      store.dispatch(dispatch);
    } else {
      // add up stored result
      var taxes = this.get('taxes');
      that.setTaxDetail(taxes, 'taxDetail', 'tax');
    }
  }.observes('extendedPrice', 'taxType'),
  
  /**
    Called when item or invoice tax zone changes.
  */

  taxTypeCriteriaDidChange: function() {
    if (this.isNotDirty()) return;
       
    var isItem = this.get('isItem'),
        item = this.get('item'),
        taxZone = this.getPath('invoice.taxZone'),
        that = this;
        
    // update tax type if we can
    if (isItem && item && taxZone) {
    
      // callback
      callback = function(err, result) {
        var store = that.get('store'),
            taxType = store.find('XM.TaxType', result);
        that.set('taxType', taxType);
      }

      // make the request
      XM.Item.taxType(item, taxZone, callback);
    }
  }.observes('item'),

  taxDidChange: function() {
    var invoice = this.get('invoice');
    if (invoice) invoice.updateLineTax();
  }.observes('tax'),


});
