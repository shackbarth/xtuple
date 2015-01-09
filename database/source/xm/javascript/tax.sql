select xt.install_js('XM','Tax','xtuple', $$
/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
   See www.xtuple.com/CPAL for the full text of the software license. */

(function () {

  if (!XM.Tax) { XM.Tax = {}; }

  XM.Tax.isDispatchable = true;

  /**
   Return the calculated tax detail for a given amount, currency, and date.

   @param {Number} tax zone id
   @param {Number} tax type id
   @param {Date} effective date
   @param {Number} currency id
   @param {Number} amount
   @returns Array 
  */
  XM.Tax.taxDetail = function(taxZoneId, taxTypeId, effective, currencyId, amount) {
    var ret,
        sql = 'select tx as "taxCode", bs as "basisTaxCode", ' 
            + '  taxdetail_taxclass_sequence as "sequence", taxdetail_taxrate_percent as "percent", '
            + '  taxdetail_taxrate_amount as "amount", taxdetail_tax as "tax" '
            + 'from calculatetaxdetail($1::integer, $2::integer, $3::date, $4::integer, $5::numeric) '
            + '  join xm.tax_code tx on tx.id=taxdetail_tax_id ' 
            + '  left join xm.tax_code bs on bs.id=taxdetail_tax_basis_tax_id ' 
            + 'order by sequence, tx.code;';
    /* resolve natural keys to primary keys */
    taxZoneId = taxZoneId ? XT.Data.getId(XT.Orm.fetch('XM', 'TaxZone'), taxZoneId) : taxZoneId;
    taxTypeId = taxTypeId ? XT.Data.getId(XT.Orm.fetch('XM', 'TaxType'), taxTypeId) : taxTypeId;
    currencyId = currencyId ? XT.Data.getId(XT.Orm.fetch('XM', 'Currency'), currencyId) : currencyId;
    
    ret = plv8.execute(sql, [taxZoneId || -1, taxTypeId || -1, effective, currencyId, amount]);
    for (var i = 0; i < ret.length; i++) ret[i].taxCode = XT.camelize(ret[i].taxCode);
    return ret;
  };
  XM.Tax.taxDetail.description = "Returns the calculated tax detail for a given amount, currency, and date";
  XM.Tax.taxDetail.params = {
    taxZoneId: {type: "Number", description: "Tax Zone ID"},
    taxTypeId: {type: "Number", description: "Tax Type ID"},
    effective: {type: "Date", description: "Effective Date"},
    currencyID: {type: "Number", description: "Currency ID"},
    amount: {type: "Number", description: "Taxable Amount"}
  };

  if (!XM.TaxAuthority) { XM.TaxAuthority = {}; }

  XM.TaxAuthority.isDispatchable = true;

  /**
    Return whether a tax authority is referenced by another table.
    
    @param {String} Tax Authority Number
  */
  XM.TaxAuthority.used = function(id) {
    var exceptions = ["public.crmacct"];
    return XM.PrivateModel.used("XM.TaxAuthority", id, exceptions);
  };

}());
  
$$ );

