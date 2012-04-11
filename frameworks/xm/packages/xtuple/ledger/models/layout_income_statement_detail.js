// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_layout_income_statement_detail');

/**
  @class

  @extends XM.Record
*/
XM.LayoutIncomeStatementDetail = XT.Record.extend(XM._LayoutIncomeStatementDetail,
  /** @scope XM.LayoutIncomeStatementDetail.prototype */ {

  // .................................................
  // CALCULATED PROPERTIES
  //

  /**
    TODO: move to XM.SubAccountType as a function 
          mixin

  XM.SubAccountType.getTypes = function() {
    if(!this._subAccountTypes) {
      var qry = SC.Query.local(XM.SubAccountType),
          store = this.get('store');

      this._subAccountTypes = store.find(qry);
    }
    return this._subAccountTypes;
  }

  */

  filteredSubAccounts: function() {
    var subAccountTypes = XM.SubAccountType.getTypes(),
        record = this,
        ret;

    ret = subAccountTypes.filter(function(subAccountType) {
      var accountType = record.get('accountType');

      if(accountType) {
      return subAccountType.get('accountType') === accountType;
      } else {
        return subAccountType;
      }
    }, this);

    return ret;
  }.property('accountType').cacheable(),

  //..................................................
  // METHODS
  //

  init: function() {
    this.subAccounts = XM.SubAccountType();
  },

  updateSubAccountTypes: function() {
    
  },

  //..................................................
  // OBSERVERS
  //

});

XM.LayoutIncomeStatementDetail.mixin( /** @scope XM.LayoutIncomeStatementDetail */ {

/**
  @static
  @constant
  @type String
  @default A
*/
  ASSET: A,

/**
  @static
  @constant
  @type String
  @default E
*/
  EXPENSE: E,

/**
  @static
  @constant
  @type String
  @default L
*/
  LIABILITY: L,

/**
  @static
  @constant
  @type String
  @default Q
*/
  EQUITY: Q,

/**
  @static
  @constant
  @type String
  @default R
*/
  REVENUE: R

});
