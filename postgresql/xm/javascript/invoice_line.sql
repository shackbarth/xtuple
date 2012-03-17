select xt.install_js('XM','InvoiceLine','xtuple', $$
/* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
   See www.xtuple.com/CPAL for the full text of the software license. */

  XM.InvoiceLine = {};

  XM.InvoiceLine.isDispatchable = true;

  /**
   Return the tax detail for line items based on input. Pass invoice
   line id in as the one and only argument to get tax records stored
   on the database. Pass in tax zone, taxtype, effective date, currency 
   and amount to return estimated tax results.

   @param {Number} invoice line or tax zone id
   @param {Number} tax type id - optional
   @param {Number} currency id
   @param {Date} effective date
   @param {Number} amount
   @returns Number 
  */
  XM.InvoiceLine.taxDetail = function(id, taxTypeId, effective, currencyId, amount) {
    var ret = [], sql, res;
    res = arguments.length > 1 ? 
          XM.Tax.calculate(id, taxTypeId, effective, currencyId, amount) :
          XM.Tax.history('invcitemtax', id);

    /* reduce the result set */
    for (var i = 0; i < res.length; i++) {
      var taxDetail = {};
      taxDetail.taxCode = res[i].taxCode;
      taxDetail.tax = res[i].tax;
      ret.push(taxDetail);
    }
    return JSON.stringify(ret, null, 2);
  }

$$ );