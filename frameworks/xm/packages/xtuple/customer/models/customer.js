// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */


sc_require('mixins/_customer');

/**
  @class

  @extends XM.Document
  @extends XM.CoreDocuments
*/
XM.Customer = XM.Document.extend(XM.CoreDocuments, XM._Customer,
  /** @scope XM.Customer.prototype */ {

  numberPolicySetting: 'CRMAccountNumberGeneration'

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
  Return the price for an item for a customer.
  
  @param {Number} customer
  @param {Number} shipto (optional)
  @param {Number} item
  @param {Number} quantity
  @param {Number} quantity unit
  @param {Number} currency
  @param {Date} effective date
  @returns Number
*/
XM.Customer.price = function(customer, shipto, item, quantity, quantityUnit, priceUnit, currency, effective, callback) {  
  var that = this, dispatch;
  dispatch = XM.Dispatch.create({
    className: 'XM.Customer',
    functionName: 'price',
    parameters: [
      customer.get('id'),
      shipto ? shipto.get('id') : null,
      item.get('id'),
      quantity,
      quantityUnit.get('id'),
      priceUnit.get('id'),
      currency.get('id'),
      effective.toFormattedString('%Y-%m-%d')
    ],
    target: that,
    action: callback
  });
  customer.get('store').dispatch(dispatch);
  return this;
}

