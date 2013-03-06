select xt.install_js('XM','Sales','xtuple', $$
/* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
   See www.xtuple.com/CPAL for the full text of the software license. */

  XM.Sales = {};

  XM.Sales.isDispatchable = true;

  XM.Sales.options = [
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
    "DefaultShipFormId",
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
  ]
  
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
        qry;
    
    ret.NextSalesOrderNumber = plv8.execute(sql, ['SoNumber'])[0].value;
    ret.NextQuoteNumber = plv8.execute(sql, ['QuNumber'])[0].value;
    ret.NextCreditMemoNumber = plv8.execute(sql, ['CmNumber'])[0].value;
    ret.NextInvoiceNumber = plv8.execute(sql, ['InvcNumber'])[0].value;
    
    ret = XT.extend(ret, data.retrieveMetrics(keys));
    
    return JSON.stringify(ret);
  }
  
  /* 
  Update Sales configuration settings. Only valid options as defined in the array
  XM.Sales.options will be processed.

   @param {Object} settings
   @returns {Boolean}
  */
  XM.Sales.commitSettings = function(settings) {
    var sql, options = XM.Sales.options.slice(0),
        data = Object.create(XT.Data), metrics = {};
        
    /* check privileges */
    if(!data.checkPrivilege('ConfigureSales')) throw new Error('Access Denied');

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
      plv8.execute('select setNextInNumber($1)', [settings['NextInvoiceNumber'] - 0]);
    }
    options.remove('NextInvoiceNumber');
  
  /* update remaining options as metrics
       first make sure we pass an object that only has valid metric options for this type */
    for(var i = 0; i < options.length; i++) {
      var prop = options[i];
      if(settings[prop] !== undefined) metrics[prop] = settings[prop];
    }
 
    return data.commitMetrics(metrics);
  }
  
$$ );
