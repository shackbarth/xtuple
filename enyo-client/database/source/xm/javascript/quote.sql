select xt.install_js('XM','Quote','xtuple', $$
/* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
   See www.xtuple.com/CPAL for the full text of the software license. */

  XM.Quote = {};

  XM.Quote.isDispatchable = true;

  /**
    Fetch the next quote number. Need a special over-ride here because of peculiar
    behavior of quote numbering different from all other generated numbers.
  */
  XM.Quote.fetchNumber = function () {
    return plv8.execute("select fetchqunumber() as number")[0].number;
  };
  
  /**
   Returns an array of freight detail records based on input

   @param {Number} Customer id
   @param {Number} Shipto id
   @param {Number} Ship Zone id
   @param {Date} Quote Date
   @param {String} Ship Via
   @param {Number} Currency Id
   @param {Number} Site Id
   @param {Number} Freight Class Id
   @param {Number} Weight
   
   @returns Array 
  */
  XM.Quote.freightDetail = function(customerId, shiptoId, shipZoneId, quoteDate, shipVia, currencyId, siteId, freightClassId, weight) {
    var sql1 = "select custtype_id, custtype_code from custinfo join custtype on custtype_id=cust_custtype_id where cust_id=$1;",
      sql2 = "select shipto_num from shiptoinfo where shipto_id=$1;",
      sql3 = "select currconcat($1) as currabbr;",
      sql4 = "select * from calculatefreightdetail($1, $2, $3, $4::integer, $5::integer, $6, $7::date, $8, $9, $10, $11, $12::integer, $13::numeric);",
      customerTypeId,
      customerTypeCode,
      currencyAbbreviation,
      shipToNumber,
      query,
      row,
      results = [],
      i;

    /* Fetch customer type information */
    query = plv8.execute(sql1, [customerId]);
    if (!query.length) { plv8.elog(ERROR, "Invalid Customer") };
    customerTypeId = query[0].custtype_id;
    customerTypeCode = query[0].custtype_code;

    /* Fetch shipto information */
    if (shiptoId) {
      query = plv8.execute(sql2, [shiptoId]);
      if (!query.length) { plv8.elog(ERROR, "Invalid Shipto") };
      shiptoNumber = query[0].shipto_num;
    } else {
      shiptoId = -1;
      shiptoNumber = "";
    }

    /* Fetch currency */
    query = plv8.execute(sql3, [currencyId]);
    if (!query.length) { plv8.elog(ERROR, "Invalid Currency") };
    currencyAbbreviation = query[0].currabbr;

    /* Get the data */
    query = plv8.execute(sql4, [customerId, customerTypeId, customerTypeCode,
      shiptoId, shipZoneId, shiptoNumber, quoteDate, shipVia, currencyId, currencyAbbreviation,
      siteId, freightClassId, weight]);

    /* Finally, map to JavaScript friendly names */
    for (i = 0; i < query.length; i++) {
      row = query[i];
      results.push({
        schedule: row.freightdata_schedule,
        from: row.freightdata_from,
        to: row.freightdata_to,
        shipVia: row.freightdata_shipvia,
        freightClass: row.freightdata_freightclass,
        weight: row.freightdata_weight,
        unit: row.freightdata_uom,
        price: row.freightdata_price,
        type: row.freightdata_type,
        total: row.freightdata_total,
        currency: row.freightdata_currency
      });
    }
    return JSON.stringify(results);
  };

  /**
    Release a quote number. Need a special over-ride here because of peculiar
    behavior of quote numbering different from all other generated numbers.

    @param {String} Number
    @returns Number
  */
  XM.Quote.releaseNumber = function (recordType, num) {
    return plv8.execute("select releasequnumber($1) as result", [num])[0].result;
  };
  

  /**
   Return the calculated tax detail for a given amount, currency, and date.

   @param {Number} tax zone id
   @param {Number} tax type id
   @param {Date} effective date
   @param {Number} currency id
   @param {Number} amount
   @returns Array 
  */
  XM.Quote.taxDetail = function(taxZoneId, taxTypeId, effective, currencyId, amount) {
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
    return JSON.stringify(ret);
  };
  
$$ );
