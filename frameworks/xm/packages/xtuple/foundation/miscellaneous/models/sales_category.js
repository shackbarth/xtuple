// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_sales_category');

/**
  @class

  @extends XM.Document
*/
XM.SalesCategory = XM.Document.extend(XM._SalesCategory,
  /** @scope XM.SalesCategory.prototype */ {

  documentKey: 'name',

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
XM.SalesCategory.none = function() {
  if (!this._xm_salesCatNone) {
    var tmp = XT.store.pushRetrieve(XM.ItemInfo, -1, { 
      guid: -1, 
      isActive: false,
      name: ''
    });
    this._xm_salesCatNone = XT.store.materializeRecord(tmp).normalize(true);
  }
  return this._xm_salesCatNone;
};
