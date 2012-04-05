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
      "read": "MaintainFinancialLayouts",
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
    isRequired: true,
    label: '_name'.loc()
  }),

  /**
    @type String
  */
  description: SC.Record.attr(String, {
    label: '_description'.loc()
  }),

  /**
    @type Boolean
  */
  isActive: SC.Record.attr(Boolean, {
    defaultValue: true,
    label: '_isActive'.loc()
  }),

  /**
    @type XM.LayoutIncomeStatementGroup
  */
  groups: SC.Record.toMany('XM.LayoutIncomeStatementGroup', {
    isNested: true,
    inverse: 'layoutIncomeStatement',
    label: '_groups'.loc()
  }),

  /**
    @type XM.LayoutIncomeStatementDetail
  */
  details: SC.Record.toMany('XM.LayoutIncomeStatementDetail', {
    isNested: true,
    inverse: 'layoutIncomeStatement',
    label: '_details'.loc()
  }),

  /**
    @type String
  */
  notes: SC.Record.attr(String, {
    label: '_notes'.loc()
  }),

  /**
    @type Boolean
  */
  isShowTotal: SC.Record.attr(Boolean, {
    defaultValue: false,
    label: '_isShowTotal'.loc()
  }),

  /**
    @type Boolean
  */
  isAlternateBudget: SC.Record.attr(Boolean, {
    defaultValue: false,
    label: '_isAlternateBudget'.loc()
  }),

  /**
    @type String
  */
  budgetLabel: SC.Record.attr(String, {
    label: '_budgetLabel'.loc()
  }),

  /**
    @type Boolean
  */
  isAlternateTotal: SC.Record.attr(Boolean, {
    defaultValue: false,
    label: '_isAlternateTotal'.loc()
  }),

  /**
    @type String
  */
  alternateTotalLabel: SC.Record.attr(String, {
    label: '_alternateTotalLabel'.loc()
  }),

  /**
    @type Boolean
  */
  isSystem: SC.Record.attr(Boolean, {
    label: '_isSystem'.loc()
  })

};
