// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_item');

/**
  @class

  @extends XM._Item
  @extends XM.Documents
  @extends XM.Document
*/
XM.Item = XM.Document.extend(XM._Item, XM.Documents,
  /** @scope XM.Item.prototype */ {

  // .................................................
  // CALCULATED PROPERTIES
  //
/*
  number: SC.Record.attr(Number, {
   toType: function(record, key, value) {
    if(value) return value.toUpperCase();
   }
  }),

  unitAvailableTypes: function(){
    var unitType = this.get('unitType'),
        fromUnit = this.get('fromUnit'), //LB
        toUnit = this.get('toUnit'), //EA
        multiple = this.get('multiple'); //Bool flag true for selling than false for cap, alt cap and material issue
    if(multiple === true) { //Look at itemuomtouom function in public on postgresql
      //check to see if multiple if they have the type push in
      //selling(guid 1), capacity(2), altcapacity(3), materialissue(4) 
      //selling can be used multiple time but 2,3,4 can only be used once per item of given unit type
       this.set('value'),
    } else if(multiple === false) {
      this.set('value'),
    }
  },

  itemTaxTypes: function() {
    var itemTaxType = this.get('itemTaxType'),
        itemTaxZone = this.get('itemTaxZone'),
    if(itemTaxZone) {
      // item_tax 
      // item_tax_recoverable sets a true flag when a new item is created in the parent | make sure to update the orm to pull this in 
      return;
    }
  },
*/
  //..................................................
  // METHODS
  //

  //..................................................
  // OBSERVERS
  //
  _xm_unitSelectedTypeDidChange: function(){
    var status = this.get('status'),
        toUnit = this.get('toUnit');
    if(status & SC.Record.READY) {
      //if selected type is removed reevaluate the selected values and send to Available types
    }
  }.observes('toUnit'),
  _xm_itemUnitDidChange: function() {
    if(this.get('status') === SC.Record.READY_CLEAN) {
      this.item.set('isEditable', false);
    }
  },//.observes('status')
  _xm_itemInventoryConversionDidChange: function() {
    var status = this.get('status'),
        inventoryUnit = this.get('inventoryUnit');
    if(status & SC.Record.READY) {
         this.set('priceUnit', this.get('inventoryUnit'));       
    }
  }.observes('inventoryUnit')

});

/**
  Request the selling units of measure for an item.
  
  @param {XM.Item|XM.ItemInfo} item
  @param {Function} callback
  @returns receiver
*/
XM.Item.sellingUnits = function(item, callback) {
  return XM.Item._xm_units(item, 'sellingUnits', callback);
}

/**
  Request the selling units of measure for an item.
  
  @param {XM.Item|XM.ItemInfo} item
  @param {Function} callback
  @returns receiver
*/
XM.Item.materialIssueUnits = function(item, callback) {
  return XM.Item._xm_units(item, 'materialIssueUnits', callback);
}

/**
  Requests a unit of measure conversion ratio for a given item, from unit 
  and to unit.
  
  @param {Number} item
  @param {Number} from unit
  @param {Number} to unit
  @param {Function} callback
  @returns receiver
*/
XM.Item.unitToUnitRatio = function(item, fromUnit, toUnit, callback) {
  if((!SC.kindOf(item, XM.Item) &&
      !SC.kindOf(item, XM.ItemInfo)) ||
      !SC.kindOf(fromUnit, XM.Unit) ||
      !SC.kindOf(toUnit, XM.Unit)) return false;
     
  var that = this, dispatch;
  
  dispatch = XT.Dispatch.create({
    className: 'XM.Item',
    functionName: 'unitToUnitRatio',
    parameters: [
      item.get('id'),
      fromUnit.get('id'),
      toUnit.get('id')
    ],
    target: that,
    action: callback
  });
  console.log("Unit Conversion Ratio for: %@".fmt(item.get('id')));
  item.get('store').dispatch(dispatch);
  
  return this;
}

/**
  Request the tax type for an item in a given tax zone.
  
  @param {XM.Item|XM.ItemInfo} item
  @param {XM.TaxZone}
  @param {Function} callback
  @returns receiver
*/
XM.Item.taxType = function(item, taxZone, callback) {
  if((!SC.kindOf(item, XM.Item) &&
     !SC.kindOf(item, XM.ItemInfo)) ||
     !SC.kindOf(taxZone, XM.TaxZone)) return false;
     
  var that = this, dispatch;
  
  dispatch = XT.Dispatch.create({
    className: 'XM.Item',
    functionName: 'taxType',
    parameters: [
      item.get('id'),
      taxZone.get('id')
    ],
    target: that,
    action: callback
  });
  console.log("XM.TaxType for: %@".fmt(item.get('id')));
  item.get('store').dispatch(dispatch);
  
  return this;
}

/** @private */
XM.Item._xm_units = function(item, type, callback) {
  if(!SC.kindOf(item, XM.Item) &&
     !SC.kindOf(item, XM.ItemInfo)) return false;
     
  var that = this,
      id = item.get('id'),
      dispatch;
      
  dispatch = XT.Dispatch.create({
    className: 'XM.Item',
    functionName: type,
    parameters: id,
    target: that,
    action: callback
  });
  console.log("XM.Units.%@ for: %@".fmt(type, id));
  item.get('store').dispatch(dispatch);
  
  return this;
}

