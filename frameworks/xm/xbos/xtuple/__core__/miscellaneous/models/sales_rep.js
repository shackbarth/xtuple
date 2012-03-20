// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('xbos/__generated__/_sales_rep');
sc_require('mixins/document');

/**
  @class

  @extends XM._SalesRep
*/
XM.SalesRep = XM._SalesRep.extend(XM.Document,
  /** @scope XM.SalesRep.prototype */ {
  
  // .................................................
  // CALCULATED PROPERTIES
  //

  numberPolicySetting: 'CRMAccountNumberGeneration',
  
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

  validate: function() {
    return arguments.callee.base.apply(this, arguments);
  }.observes('name')

});
