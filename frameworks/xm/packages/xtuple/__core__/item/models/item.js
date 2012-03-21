// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('packages/xtuple/__core__/item/mixins/_item');

/**
  @class

  @extends XM.Record
*/
XM.Item = XM.Record.extend(XM._Item, XM.CoreDocuments,
  /** @scope XM.Item.prototype */ {

  // .................................................
  // CALCULATED PROPERTIES
  //

  //..................................................
  // METHODS
  //

  //..................................................
  // OBSERVERS
  //

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

