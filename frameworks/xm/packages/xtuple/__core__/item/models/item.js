// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('packages/xtuple/__core__/item/mixins/_item');
sc_require('mixins/crm_documents');

/**
  @class

  @extends XM._Item
  @extends XM.CrmDocuments
  @extends XM.CoreDocuments
  @extends XM.Document
*/
XM.Item = XM._Item.extend(XM._Item, XM.CoreDocuments, XM.CrmDocuments,
  /** @scope XM.Item.prototype */ {

  // .................................................
  // CALCULATED PROPERTIES
  //

  number: SC.Record.attr(Number, {
   toType: function(record, key, value) {
    if(value) return value.toUpperCase();
   }
  }),
  // item_tax 
  // item_tax_recoverable sets a true flag when a new item is created in the parent | make sure to update the orm to pull this in 
  // item_uom

  //..................................................
  // METHODS
  //

  //..................................................
  // OBSERVERS
  //
  _xm_itemTypeDidChange: function() {
   var status = this.get('status'),
       itemType = this.get('itemType'),
       isPickList = false,
       isSold = false,
       weight = false,
       config = false,
       shipUOM = false,
       capUOM = false,
       planType = false,
       purchased = false,
       freight = false;
   if(status & SC.Record.READY) {
    switch(itemType) {
    case "P" :
    case "M" :
     this.set('isPicklist', true),
     this.set('isSold', true),
     this.set('weight', true),
     this.set('config', true),
     this.set('shipUOM', true),
     this.set('capUOM', true),
     this.set('planType', true),
     this.set('purchased', true),
     this.set('freight', true);
    break;
    case "F" : 
     this.set('planType', true);
    break;
    case "B" :
     this.set('capUOM', true),
     this.set('planType', true),
     this.set('purchased', true),
     this.set('freight', true);
    break;
    case "C" :
    case "Y" :
     this.set('isPicklist', true),
     this.set('isSold', true),
     this.set('weight', true),
     this.set('capUOM', true),
     this.set('shipUOM', true),
     this.set('planType', true),
     this.set('freight', true);
    break;
    case "R" :
     this.set('isSold', true),
     this.set('weight', true),
     this.set('capUOM', true),
     this.set('shipUOM', true),
     this.set('freight', true),
     this.set('config', true);
    break;
    case "T" :
     this.set('isPicklist', true),
     this.set('weight', true),
     this.set('capUOM', true),
     this.set('shipUOM', true),
     this.set('freight', true),
     this.set('purchased', true),
     this.set('isSold', true);
    break;
    case "O" :
     this.set('capUOM', true),
     this.set('planType', true),
     this.set('purchased', true), 
     this.set('freight', true);
    break;
    case "A" :
     this.set('isSold', true),
     this.set('planType', true),
     this.set('freight', true);
    break;
    case "K" :
     this.set('isSold', true),
     this.set('weight', true);
    break;
    }
  }
  }.observes('itemType'),
});

/**
  Request the selling units of measure for an item.
  
  @param {XM.Item|XM.ItemInfo|XM.ItemBrowse} item
  @param {Function} callback
  @returns receiver
*/
XM.Item.sellingUnits = function(item, callback) {
  return XM.Item._xm_units(item, 'sellingUnits', callback);
}

/**
  Request the selling units of measure for an item.
  
  @param {XM.Item|XM.ItemInfo|XM.ItemBrowse} item
  @param {Function} callback
  @returns receiver
*/
XM.Item.materialIssueUnits = function(item, callback) {
  return XM.Item._xm_units(item, 'materialIssueUnits', callback);
}

/** @private */
XM.Item._xm_units = function(item, type, callback) {
  if(!SC.kindOf(item, XM.Item) &&
     !SC.kindOf(item, XM.ItemInfo) &&
     !SC.kindOf(item, XM.ItemBrowse)) return false;
  
  var self = this,
      id = item.get('id'),
      dispatch;

  dispatch = XM.Dispatch.create({
    className: 'XM.Item',
    functionName: type,
    parameters: id,
    target: self,
    action: callback
  });

  console.log("XM.Item.%@ for: %@".fmt(type, id));

  item.get('store').dispatch(dispatch);
  
  return this;
}

