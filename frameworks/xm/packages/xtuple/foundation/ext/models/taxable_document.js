// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */
/**
  @class
  
  Used for all documents that support miscellaneous adjustment taxes. Should be
  used in conjunction with XM.AdjustmentTax.

  @seealso XM.AdjustmentTax
  @extends XM.Document
  @extends XM.Taxable
*/
XM.TaxableDocument = XM.Document.extend(XM.Taxable,
  /** @scope XM.TaxableDocument.prototype */ {
 
  /** @private */
  adjustmentTaxesLength: 0,
  
  /** @private */
  adjustmentTaxesLengthBinding: SC.Binding.from('*adjustmentTaxes.length').oneWay().noDelay(), 

  /**
    Total of miscellaneous tax adjustments.
    
    @type Number
  */
  miscTax: 0,
  
  /**

  //..................................................
  // CALCULATED PROPERTIES
  // 
  
  //..................................................
  // METHODS
  //
  
  /**
    Recaclulate tax adjustment total. Tax adjustment child record will call this when
    they are destoryed.
  */
  updateMiscTax: function() {  
    var taxes = this.get('adjustmentTaxes'),
        miscTax = 0;
    for(var i = 0; i < taxes.get('length'); i++) {
      var misc = taxes.objectAt(i),
          status = misc.get('status'),
          tax = status & SC.Record.DESTROYED ? 0 : misc.get('tax');
      miscTax = miscTax + tax; 
    } 
    this.setIfChanged('miscTax', miscTax.toMoney());
  },

  //..................................................
  // OBSERVERS
  //
  
  /**
    Update misc. tax totals when tax adjustment records are added.
  */
  miscTaxesLengthDidChange: function() {
    this.updateMiscTax();
  }.observes('adjustmentTaxesLength')

});
