// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('xbos/__generated__/_reason_code');
sc_require('mixins/document');

/**
  @class

  @extends XM._ReasonCode
*/
XM.ReasonCode = XM._ReasonCode.extend(XM.Document,
  /** @scope XM.ReasonCode.prototype */ {

  // see document mixin for object behavior(s)
  documentKey = 'code';

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
