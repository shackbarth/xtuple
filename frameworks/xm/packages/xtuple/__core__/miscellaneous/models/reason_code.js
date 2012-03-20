// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_reason_code');

/**
  @class

  @extends XM.Document
*/
XM.ReasonCode = XM.Document.extend(XM._ReasonCode,
  /** @scope XM.ReasonCode.prototype */ {

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

  validate: function() {
    return arguments.callee.base.apply(this, arguments);
  }.observes('code')

});

// TODO: move this mixin, as necessary, to the associated extension(s)

XM.ReasonCode.mixin( /** @scope XM.ReasonCode */ {

/**
  Selected Document Type - A/R Credit Memo.
  
  @static
  @constant
  @type String
  @default P
*/
  CREDIT_MEMO: 'ARCM',

/**
  Selected Document Type - A/R Debit Memo.
  
  @static
  @constant
  @type String
  @default D
*/
  DEBIT_MEMO: 'ARDM',

/**
  Selected Document Type - Return Authorization

  @static
  @constant
  @type String
  @default N
*/
  RETURN_AUTH: 'RA'

});
