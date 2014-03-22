select xt.install_js('XM','Sales','xtuple', $$
/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
   See www.xtuple.com/CPAL for the full text of the software license. */

(function () {
  var salesOptions = [
    "CONumberGeneration",
    "CMNumberGeneration",
    "QUNumberGeneration",
    "InvcNumberGeneration",
    "NextSalesOrderNumber",
    "NextCreditMemoNumber",
    "NextQuoteNumber",
    "NextInvoiceNumber",
    "InvoiceDateSource",
    "QuoteChangeLog",
    "ShowQuotesAfterSO",
    "AllowDiscounts",
    "AllowASAPShipSchedules",
    "SalesOrderChangeLog",
    "RestrictCreditMemos",
    "AutoSelectForBilling",
    "AlwaysShowSaveAndAdd",
    "FirmSalesOrderPackingList",
    "DisableSalesOrderPriceOverride",
    "AutoAllocateCreditMemos",
    "HideSOMiscCharge",
    "EnableSOShipping",
    "DefaultPrintSOOnSave",
    "UsePromiseDate",
    "CalculateFreight",
    "IncludePackageWeight",
    "ShowQuotesAfterSO",
    "soPriceEffective",
    "UpdatePriceLineEdit",
    "IgnoreCustDisc",
    "CustomerChangeLog",
    "DefaultShipViaId",
    "DefaultBalanceMethod",
    "DefaultCustType",
    "DefaultSalesRep",
    "DefaultTerms",
    "DefaultPartialShipments",
    "DefaultBackOrders",
    "DefaultFreeFormShiptos",
    "SOCreditLimit",
    "SOCreditRate"
  ],
    i, option;

  if (XM.Sales) {
    for(i = 0; i < salesOptions.length; i++) {
      option = salesOptions[i];
      if(!XM.Sales.options.contains(option)) {
        XM.Sales.options.push(option);
      }
    }

  } else {
    XM.Sales = {};
    XM.Sales.options = salesOptions;
  }

  XM.Sales.isDispatchable = true;

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
  XM.Sales.freightDetail = function(customerId, shiptoId, shipZoneId, orderDate, shipVia, currencyId, siteId, freightClassId, weight) {
    var sql1 = "select custtype_id, custtype_code from custinfo join custtype on custtype_id=cust_custtype_id where cust_number=$1;",
      sql2 = "select shipto_num from shiptoinfo where obj_uuid=$1;",
      sql3 = "select currconcat(curr_id) as currabbr from curr_symbol where curr_abbr = $1;",
      sql4 = "select * from calculatefreightdetail($1, $2, $3, $4::integer, $5::integer, $6, $7::date, $8, $9, $10, $11, $12::integer, $13::numeric);",
      sqlParams,
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
      shiptoId = XT.Data.getId(XT.Orm.fetch('XM', 'CustomerShipto'), shiptoId);
    } else {
      shiptoId = -1;
      shiptoNumber = "";
    }

    /* Fetch currency */
    query = plv8.execute(sql3, [currencyId]);
    if (!query.length) { plv8.elog(ERROR, "Invalid Currency") };
    currencyAbbreviation = query[0].currabbr;

    /* resolve natural keys to primary keys */
    customerId = XT.Data.getId(XT.Orm.fetch('XM', 'Customer'), customerId);
    shipZoneId = shipZoneId ? XT.Data.getId(XT.Orm.fetch('XM', 'ShipZone'), shipZoneId) : shipZoneId;
    freightClassId = freightClassId ? XT.Data.getId(XT.Orm.fetch('XM', 'FreightClass'), freightClassId) : freightClassId;
    siteId = siteId ? XT.Data.getId(XT.Orm.fetch('XM', 'Site'), siteId) : siteId;
    currencyId = currencyId ?
      XT.Data.getId(XT.Orm.fetch('XM', 'Currency'), currencyId) :
      plv8.execute("select basecurrid() as result")[0].result;

    /* Get the data */
    sqlParams = [customerId, customerTypeId, customerTypeCode,
      shiptoId, shipZoneId, shiptoNumber, orderDate, shipVia, currencyId, currencyAbbreviation,
      siteId, freightClassId, weight];
    if(DEBUG) { plv8.elog(NOTICE, sql4, sqlParams); }
    query = plv8.execute(sql4, sqlParams);

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
    return results;
  };
  XM.Sales.freightDetail.description = "Returns an array of freight detail records based on input";
  XM.Sales.freightDetail.params = {
   customerId: {type: "Number", description: "Customer ID"},
   shiptoId: {type: "Number", description: "Shipto ID"},
   shipZoneId: {type: "Number", description: "Ship Zone ID"},
   orderDate: {type: "Date", description: "Quote Date"},
   shipVia: {type: "String", description: "Ship Via"},
   currencyId: {type: "Number", description: "Currency ID"},
   siteId: {type: "Number", description: "Site ID"},
   freightClassId: {type: "Number", description: "Freight Class ID"},
   weight: {type: "Number", description: "Weight"}
  };

  /*
  Return Sales configuration settings.

  @returns {Object}
  */
  XM.Sales.settings = function() {
    var keys = XM.Sales.options.slice(0),
        data = Object.create(XT.Data),
        sql = "select orderseq_number as value "
            + "from orderseq"
            + " where (orderseq_name=$1)",
        ret = {},
        qry,
        orm;

    ret.NextSalesOrderNumber = plv8.execute(sql, ['SoNumber'])[0].value;
    ret.NextQuoteNumber = plv8.execute(sql, ['QuNumber'])[0].value;
    ret.NextCreditMemoNumber = plv8.execute(sql, ['CmNumber'])[0].value;
    ret.NextInvoiceNumber = plv8.execute(sql, ['InvcNumber'])[0].value;

    ret = XT.extend(data.retrieveMetrics(keys), ret);

    /* Special processing for primary key based values */
    orm = XT.Orm.fetch("XM", "CustomerType");
    ret.DefaultCustType = data.getNaturalId(orm, ret.DefaultCustType, true);

    orm = XT.Orm.fetch("XM", "SalesRep");
    ret.DefaultSalesRep = data.getNaturalId(orm, ret.DefaultSalesRep, true);

    orm = XT.Orm.fetch("XM", "ShipVia");
    ret.DefaultShipViaId = data.getNaturalId(orm, ret.DefaultShipViaId, true);

    orm = XT.Orm.fetch("XM", "Terms");
    ret.DefaultTerms = data.getNaturalId(orm, ret.DefaultTerms, true);

    return ret;
  }

  /*
  Update Sales configuration settings. Only valid options as defined in the array
  XM.Sales.options will be processed.

   @param {Object} settings
   @returns {Boolean}
  */
  XM.Sales.commitSettings = function(patches) {
    var sql, settings, options = XM.Sales.options.slice(0),
        data = Object.create(XT.Data), metrics = {};

    /* check privileges */
    if(!data.checkPrivilege('ConfigureSO')) throw new Error('Access Denied');

    /* Compose our commit settings by applying the patch to what we already have */
    settings = XM.Sales.settings();
    if (!XT.jsonpatch.apply(settings, patches)) {
      plv8.elog(NOTICE, 'Malformed patch document');
    }

    /* update numbers */
    if(settings['NextSalesOrderNumber']) {
      plv8.execute('select setNextSoNumber($1)', [settings['NextSalesOrderNumber'] - 0]);
    }
    options.remove('NextSalesOrderNumber');

    if(settings['NextCreditMemoNumber']) {
      plv8.execute('select setNextCmNumber($1)', [settings['NextCreditMemoNumber'] - 0]);
    }
    options.remove('NextCreditMemoNumber');

    if(settings['NextQuoteNumber']) {
      plv8.execute('select setNextQuNumber($1)', [settings['NextQuoteNumber'] - 0]);
    }
    options.remove('NextQuoteNumber');

    if(settings['NextInvoiceNumber']) {
      plv8.execute('select setNextInvcNumber($1)', [settings['NextInvoiceNumber'] - 0]);
    }
    options.remove('NextInvoiceNumber');

    /* update remaining options as metrics
       first make sure we pass an object that only has valid metric options for this type */
    for(var i = 0; i < options.length; i++) {
      var prop = options[i];
      if(settings[prop] !== undefined) metrics[prop] = settings[prop];
    }

    /* Special processing for primary key based values */
    if (metrics.DefaultCustType) {
      orm = XT.Orm.fetch("XM", "CustomerType");
      metrics.DefaultCustType = data.getId(orm, metrics.DefaultCustType);
    }

    if (metrics.DefaultSalesRep) {
      orm = XT.Orm.fetch("XM", "SalesRep");
      metrics.DefaultSalesRep = data.getId(orm, metrics.DefaultSalesRep);
    }

    if (metrics.DefaultShipViaId) {
      orm = XT.Orm.fetch("XM", "ShipVia");
      metrics.DefaultShipViaId = data.getId(orm, metrics.DefaultShipViaId);
    }

    if (metrics.DefaultTerms) {
      orm = XT.Orm.fetch("XM", "Terms");
      metrics.DefaultTerms = data.getId(orm, metrics.DefaultTerms);
    }

    return data.commitMetrics(metrics);
  }

}());

$$ );
