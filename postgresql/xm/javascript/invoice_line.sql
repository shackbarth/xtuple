select xt.install_js('XM','InvoiceLine','xtuple', $$
/* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
   See www.xtuple.com/CPAL for the full text of the software license. */

  XM.InvoiceLine = {};

  XM.InvoiceLine.isDispatchable = true;

  /**
   Return estimated tax detail for line items based on input.

   @param {Number} tax zone id - optional
   @param {Number} tax type id - optional
   @param {Number} currency id
   @param {Date} effective date
   @param {Number} amount
   @returns Number 
  */
  XM.InvoiceLine.calculateTax = function(taxZoneId, taxTypeId, effective, currencyId, amount) {
    var ret = [], sql, res;
        res = XM.Tax.calculate(taxZoneId, taxTypeId, effective, currencyId, amount);

    /* reduce the result set */
    for (var i = 0; i < res.length; i++) {
      var taxDetail = {};
      taxDetail.taxCode = res[i].taxCode;
      taxDetail.tax = res[i].tax;
      ret.push(taxDetail);
    }
    return JSON.stringify(ret);
  }

$$ );