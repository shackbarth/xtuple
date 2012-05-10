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
	
	/**
		Uppercase item number.
	*/	
  number: SC.Record.attr(Number, {
   toType: function(record, key, value) {
    if(value) return value.toUpperCase();
   }
  }),
  //..................................................
  // METHODS
  //

  //..................................................
  // OBSERVERS
  //
	
	/**
		Change flag to true for item type R.
	*/	
  _xm_itemTypeDidChange: function() {
   var status = this.get('status'),
       itemType = this.get('itemType');
   if(status & SC.Record.READY) {
     if(itemType === 'R'){
       this.set('isSold', true);
     } 
   }
  }.observes('itemType'),
	
	/**
		Check item unit did change set to false.
	*/	
  _xm_itemUnitDidChange: function() {
    if(this.get('status') === SC.Record.READY_CLEAN) {
      this.item.set('isEditable', false);
    }
  },//.observes('status')
	
	/**
		Select inventory uom than change price uom to the same.
	*/		
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
};

/**
  Request the selling units of measure for an item.
  
  @param {XM.Item|XM.ItemInfo} item
  @param {Function} callback
  @returns receiver
*/
XM.Item.materialIssueUnits = function(item, callback) {
  return XM.Item._xm_units(item, 'materialIssueUnits', callback);
};

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
};

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
};

/** @private */
XM.Item._xm_units = function(item, type, callback) {
  if(!SC.kindOf(item, XM.Item) &&
     !SC.kindOf(item, XM.ItemInfo)) return false;
     
  var that = this;
  var id = item.get('id');
  var key = id.toString();
  var dispatch;
  var K = XM.Item;

  // see if we have cached results
  if (K._xm_unitsCache && 
      K._xm_unitsCache[key] &&
      K._xm_unitsCache[key][type]) {
    callback(null, K._xm_unitsCache[key][type]);
  
  // then see if we have attempted to call this
  } else if (K._xm_unitsCallbacks && 
      K._xm_unitsCallbacks[key] &&
      K._xm_unitsCallbacks[key][type]) {
    K._xm_unitsCallbacks[key][type].push(callback);
    
  // no, well then lets ask
  } else {
    localCallback = function(err, results) {
      if (!K._xm_unitsCache) K._xm_unitsCache = {};
      if (!K._xm_unitsCache[key]) K._xm_unitsCache[key] = {};
      if (!K._xm_unitsCache[key][type]) K._xm_unitsCache[key][type] = results;
      
      // process the queue
      callbacks = K._xm_unitsCallbacks[key][type];
      for (var i = 0; i < callbacks.length; i++) {
        callbacks[i](null, results);
      }
    },
        
    dispatch = XT.Dispatch.create({
      className: 'XM.Item',
      functionName: type,
      parameters: id,
      target: that,
      action: localCallback
    });
    console.log("XM.Units.%@ for: %@".fmt(type, id));
    
    if (!K._xm_unitsCallbacks) K._xm_unitsCallbacks = {};
    if (!K._xm_unitsCallbacks[key]) K._xm_unitsCallbacks[key] = {};
    if (!K._xm_unitsCallbacks[key][type]) K._xm_unitsCallbacks[key][type] = [];
    K._xm_unitsCallbacks[key][type].push(callback);
    
    item.get('store').dispatch(dispatch);
  }
  
  return this;
};

