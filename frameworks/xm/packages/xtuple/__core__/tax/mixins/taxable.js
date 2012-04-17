// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.Taxable
  @mixin

*/
XM.Taxable = {
  /** @scope XM.Taxable */
  
  /**
    A common helper function that will accept an array of tax data and
    distill it into a tax detail array and total, the results of which
    will be set on this object.
    
    The each of the array contents passed must include a taxCode and tax
    property.
    
    @param {Array} tax data to parse
    @param {String} tax detail property name to set
    @param {String} tax total property name to set
  */
  setTaxDetail: function(value, taxDetailProperty, taxTotalProperty) {
    var store = this.get('store'),
        taxTotal = 0; taxDetail = [],
        isSCobj = SC.kindOf(value, SC.Object);
    for(var i = 0; i < value.get('length'); i++) {
      var storeKey, taxCode, detail,
          item = isSCobj ? value.objectAt(i) : value[i],
          tax = isSCobj ? item.get('tax') : item.tax;
      if (isSCobj) taxCode = item.get('taxCode')
      else {
        storeKey = store.loadRecord(XM.TaxCode, item.taxCode);
        taxCode = store.materializeRecord(storeKey);
      }
      taxTotal = taxTotal + tax,
      detail = SC.Object.create({ 
        taxCode: taxCode, 
        tax: tax.toSalesPrice() 
      });
      taxDetail.push(detail);
    }
    this.setIfChanged(taxDetailProperty, taxDetail);
    this.setIfChanged(taxTotalProperty, taxTotal.toSalesPrice());
  }

};
