// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.LayoutIncomeStatement
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._LayoutIncomeStatement = {
  /** @scope XM.LayoutIncomeStatement.prototype */
  
  className: 'XM.LayoutIncomeStatement',

  nestedRecordNamespace: XM,

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainFinancialLayouts",
      "read": "ViewFinancialLayouts",
      "update": "MaintainFinancialLayouts",
      "delete": "MaintainFinancialLayouts"
    }
  },

  //..................................................
  // ATTRIBUTES
  //
  
  /**
    @type Number
  */
  guid: SC.Record.attr(Number),

  /**
    @type String
  */
  name: SC.Record.attr(String, {
    isRequired: true
  }),

  /**
    @type String
  */
  description: SC.Record.attr(String),

  /**
    @type Boolean
  */
  isActive: SC.Record.attr(Boolean, {
    defaultValue: true
  }),

  /**
    @type XM.LayoutIncomeStatementGroup
  */
  groups: SC.Record.toMany('XM.LayoutIncomeStatementGroup', {
    isNested: true,
    inverse: 'layoutIncomeStatement'
  }),

  /**
    @type XM.LayoutIncomeStatementDetail
  */
  details: SC.Record.toMany('XM.LayoutIncomeStatementDetail', {
    isNested: true,
    inverse: 'layoutIncomeStatement'
  }),

  /**
    @type String
  */
  notes: SC.Record.attr(String),

  /**
    @type Boolean
  */
  isShowTotal: SC.Record.attr(Boolean, {
    defaultValue: false
  }),

  /**
    @type Boolean
  */
  isAlternateBudget: SC.Record.attr(Boolean, {
    defaultValue: false
  }),

  /**
    @type String
  */
  budgetLabel: SC.Record.attr(String),

  /**
    @type Boolean
  */
  isAlternateTotal: SC.Record.attr(Boolean, {
    defaultValue: false
  }),

  /**
    @type String
  */
  alternateTotalLabel: SC.Record.attr(String),

  /**
    @type Boolean
  */
  isSystem: SC.Record.attr(Boolean)

};
