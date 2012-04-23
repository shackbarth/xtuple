// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_item_info');

/**
  @class

  @extends XT.Record
*/
XM.ItemInfo = XT.Record.extend(XM._ItemInfo,
  /** @scope XM.ItemInfo.prototype */ {

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
  Returns a dummy item info record with an id of -1.
  
  @returns {Object} record
*/
XM.ItemInfo.none = function() {
  if (!this._xm_itemNone) {
    var tmp = XT.store.pushRetrieve(XM.ItemInfo, -1, { 
      guid: -1, 
      number: '__NONE__',
      isActive: false,
      description1: '',
      description2: '',
      inventoryUnit: -1,
      barcode: '',
      isSold: false,
      listPrice: 0,
      type: 'ItemInfo',
      dataState: 'read'
    });
    this._xm_itemNone = XT.store.materializeRecord(tmp).normalize(true);
  }
  return this._xm_itemNone;
};



