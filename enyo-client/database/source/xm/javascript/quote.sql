select xt.install_js('XM','Quote','xtuple', $$
/* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
   See www.xtuple.com/CPAL for the full text of the software license. */

  XM.Quote = {};

  XM.Quote.isDispatchable = true;
  /**
   Return the calculated tax detail for a given amount, currency, and date.

   @param {Number} tax zone id
   @param {Number} tax type id
   @param {Date} effective date
   @param {Number} currency id
   @param {Number} amount
   @returns Array 
  */
  XM.Quote.calculateTaxDetail = function(taxZoneId, taxTypeId, effective, currencyId, amount) {
    var ret,
        sql = 'select tx as "taxCode", bs as "basisTaxCode", ' 
            + '  taxdetail_taxclass_sequence as "sequence", taxdetail_taxrate_percent as "percent", '
            + '  taxdetail_taxrate_amount as "amount", taxdetail_tax as "tax" '
            + 'from calculatetaxdetail($1::integer, $2::integer, $3::date, $4::integer, $5::numeric) '
            + '  join xm.tax_code tx on tx.id=taxdetail_tax_id ' 
            + '  left join xm.tax_code bs on bs.id=taxdetail_tax_basis_tax_id ' 
            + 'order by sequence, tx.code;'
    ret = plv8.execute(sql, [taxZoneId || -1, taxTypeId || -1, effective, currencyId, amount]);
    for (var i = 0; i < ret.length; i++) ret[i].taxCode = XT.camelize(ret[i].taxCode);
    return ret;
  }
  /**
   Return the calculated tax amount for a given amount, currency, and date.

   @param {Number} tax zone id
   @param {Number} tax type id
   @param {Date} effective date
   @param {Number} currency id
   @param {Number} amount
   @returns Number 
  */  
  XM.Quote.calculateTaxAmount = function(taxZoneId, taxTypeId, effective, currencyId, amount) {
  
    return plv8.execute("select calculatetax($1, $2, $3, $4, $5) as result;", [taxZoneId, taxTypeId, effective, currencyId, amount])[0].result; 
  }
$$ );
