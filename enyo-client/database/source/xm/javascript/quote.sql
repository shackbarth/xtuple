select xt.install_js('XM','Quote','xtuple', $$
/* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
   See www.xtuple.com/CPAL for the full text of the software license. */

  XM.Quote = {};

  XM.Quote.isDispatchable = true;

  /**
   Return the calculated tax amount for a given amount, currency, and date.

   @param {Number} tax zone id
   @param {Number} tax type id
   @param {Date} effective date
   @param {Number} currency id
   @param {Number} amount
   @returns Number 
  */  
  XM.Quote.calculateItemTaxAmount = function(taxZoneId, taxTypeId, effective, currencyId, amount) {
  
    return plv8.execute("select calculatetax($1, $2, $3, $4, $5) as result;", [taxZoneId, taxTypeId, effective, currencyId, amount])[0].result; 
  }
$$ );
