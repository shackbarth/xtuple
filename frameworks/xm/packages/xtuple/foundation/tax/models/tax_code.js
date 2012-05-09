// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_tax_code');

/**
  @class

  @extends XT.Document
*/
XM.TaxCode = XM.Document.extend(XM._TaxCode,
  /** @scope XM.TaxCode.prototype */ {

  documentKey: 'code',

  basisTaxCodeList: [],

  // .................................................
  // CALCULATED PROPERTIES
  //

  //..................................................
  // METHODS
  //

  updateBasisTaxCodeList: function() {
    var taxClass = this.get('taxClass');

    if(taxClass) {
      var id = this.get('id'),
          store = this.get('store'),
          basis = [],
          qry;

      qry = SC.Query.local(XM.TaxCode, {
        conditions: "taxClass = {taxClass} " +
                    "AND id != {id} ",
        parameters: {
          taxClass: taxClass,
          id: id
        }
      });
      basis = store.find(qry);
      this.set('basisTaxCodeList', basis);
    } else {
      this.set('basisTaxCodeList', []);
    }
  },

  //..................................................
  // OBSERVERS
  //

  taxClassDidChange: function() {
    this.updateBasisTaxCodeList();
  }.observes('taxClass')

});

