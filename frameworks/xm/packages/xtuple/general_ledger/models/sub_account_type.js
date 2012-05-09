// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_sub_account_type');

/**
  @class

  @extends XT.Record
*/
XM.SubAccountType = XM.Document.extend(XM._SubAccountType,
/** @scope XM.SubAccountType.prototype */ {

  documentKey: 'code',

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

XM.SubAccountType.getTypes = function() {
   if(!this._subAccountTypes) {
     var qry = SC.Query.local(XM.SubAccountType),
         store = this.get('store');

     this._subAccountTypes = store.find(qry);
   }
   return this._subAccountTypes;
};
