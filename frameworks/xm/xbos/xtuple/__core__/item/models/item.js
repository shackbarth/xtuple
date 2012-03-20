// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('xbos/__generated__/_item');
sc_require('mixins/crm_documents');
sc_require('mixins/core_documents');
sc_require('mixins/document');

/**
  @class

  @extends XM._Item
  @extends XM.CrmDocuments
  @extends XM.CoreDocuments
  @extends XM.Document
*/
XM.Item = XM._Item.extend( XM.Document, XM.CoreDocuments, XM.CrmDocuments,
  /** @scope XM.Item.prototype */ {

  // .................................................
  // CALCULATED PROPERTIES
  //

  number: SC.Record.attr(Number, {
   toType: function(record, key, value) {
    if(value) return value.toUpperCase();
   }
  }),
  // item_tax need to create item_tax.js sub class and orm file
  // item_tax_recoverable sets a true flag when a new item is created in the parent | make sure to update the orm to pull this in 

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
  validate: function() {
   var errors = arguments.callee.base.apply(this, arguments);
  return errors;
  }.observes('inventoryUnit', 'productCategory', 'classCode', 'priceUnit'),
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

