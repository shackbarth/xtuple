// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('packages/xtuple/__core__/miscellaneous/mixins/_sales_rep');

/**
  @class

  @extends XM.Document
*/
XM.SalesRep = XM.Document.extend(XM._SalesRep,
  /** @scope XM.SalesRep.prototype */ {
  
  numberPolicySetting: 'CRMAccountNumberGeneration',

  // .................................................
  // CALCULATED PROPERTIES
  //

  isAccount: function(key, value) {
    if(value) this._xm_isAccount = value;
      return this._xm_isAccount !== undefined ?
             this._xm_isAccount : this.get('account') !== null;
  }.property('account').cacheable(),

  //..................................................
  // METHODS
  //

  //..................................................
  // OBSERVERS
  //

});
