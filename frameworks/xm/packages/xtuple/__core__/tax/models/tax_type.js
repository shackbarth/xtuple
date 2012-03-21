// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('packages/xtuple/__core__/tax/mixins/_tax_type');

/**
  @class

  @extends XM.Record
*/
XM.TaxType = XM.Record.extend(XM._TaxType,
  /** @scope XM.TaxType.prototype */ {

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
  Constant for the fixed Adjustment tax type id.
*/
XM.TaxType.ADJUSTMENT = null;

/**
  Constant for the fixed Freight tax type id.
*/
XM.TaxType.FREIGHT = null;

/** @private */
XM.TaxType._xm_setTaxTypeConstant = function(name) {
  var self = this,
      qry, ary,
      prop = name.toUpperCase();
    
  qry = SC.Query.local(XM.TaxType, {
    conditions: "name={name}",
    parameters: {
      name: name
    }
  });

  ary = XM.store.find(qry);
  
  ary.addObserver('status', ary, function observer() {
    if (ary.get('status') === SC.Record.READY_CLEAN) {
      ary.removeObserver('status', ary, observer);
      XM.TaxType[prop] = ary.firstObject().get('id');
    }
  })
}

/** @private */
XM.TaxType._xm_setTaxTypeAdjustment = function() {
  XM.TaxType._xm_setTaxTypeConstant('Adjustment');
}

/** @private */
XM.TaxType._xm_setTaxTypeFreight = function() {
  XM.TaxType._xm_setTaxTypeConstant('Freight');
}

// TODO: Move this to start up
XM.ready(function() {
  XM.dataSource.ready(XM.TaxType._xm_setTaxTypeAdjustment, this);
  XM.dataSource.ready(XM.TaxType._xm_setTaxTypeFreight, this);
});

