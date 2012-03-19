select xt.install_js('XM','Tax','xtuple', $$
/* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
   See www.xtuple.com/CPAL for the full text of the software license. */

  XM.Tax = {};

  /**
   Return the calculated tax detail for a given amount, currency, and date.

   @param {Number} tax zone id
   @param {Number} tax type id
   @param {Date} effective date
   @param {Number} currency id
   @param {Number} amount
   @returns Array 
  */
  XM.Tax.calculate = function(taxZoneId, taxTypeId, effective, currencyId, amount) {
    var ret,
        sql = 'select tx as "taxCode", bs as "basisTaxCode", '
            + '  taxdetail_taxclass_sequence as "sequence", taxdetail_taxrate_percent as "percent", '
            + '  taxdetail_taxrate_amount as "amount", taxdetail_tax as "tax" '
            + 'from calculatetaxdetail($1, $2, $3::date, $4, $5) '
            + '  join xm.tax_code tx on tx.guid=taxdetail_tax_id '
            + '  left join xm.tax_code bs on bs.guid=taxdetail_tax_basis_tax_id '
            + 'order by sequence, tx.code;'
    ret = executeSql(sql, [taxZoneId || -1, taxTypeId || -1, effective, currencyId, amount]);
    for (var i = 0; i < ret.length; i++) ret[i].taxCode = XT.camelize(ret[i].taxCode);
    return ret;
  }

  /**
   Return a tax history array for documents based on type and record id.

   @param {String} type - table name
   @param {Number} parent id 
   @param {Number} tax type id - optional
   @returns Array 
  */
  XM.Tax.history = function(type, id, taxTypeId) {
    var ret,
        sql = 'select taxhist_id as "id", taxhist_parent_id as "parent", '
            + '  tax_type as "taxType", tx as "taxCode", '
            + '  taxhist_basis as "basis", bs as "basisTaxCode", '
            + '  taxhist_sequence as "sequence", taxhist_percent as "percent", ' 
            + '  taxhist_amount as "amount", taxhist_tax as "tax", '
            + '  taxhist_docdate as "documentDate" '
            + 'from taxhist '
            + '  join xm.tax_code tx on tx.guid=taxhist_tax_id '
            + '  left join xm.tax_code bs on bs.guid=taxhist_basis_tax_id '
            + '  left join xm.tax_type on tax_type.guid=taxhist_taxtype_id '
            + 'where taxhist.tableoid::regclass::text=$1 '
            + '  and taxhist_parent_id=$2'
            + '  and {typeClause} '
            + 'order by sequence, tx.code;';
    sql = sql.replace(/{typeClause}/, taxTypeId ? 'taxhist_taxtype_id=' + taxTypeId : 'true');
    ret = executeSql(sql, [type, id]);
    for (var i = 0; i < ret.length; i++) ret[i].taxCode = XT.camelize(ret[i].taxCode);
    return ret;
  }

$$ );