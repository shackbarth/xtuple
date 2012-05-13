select xt.install_js('XM','billing','billing', $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */
  
  XM.Billing = {};

  XM.Billing.isDispatchable = true,

  XM.Billing.options = [
    "NextARMemoNumber",
    "NextCashRcptNumber",
    "HideApplyToBalance",
    "EnableCustomerDeposits",
    "CreditTaxDiscount",
    "remitto_name",
    "remitto_address1",
    "remitto_address2",
    "remitto_address3",
    "remitto_city",
    "remitto_state",
    "remitto_zipcode",
    "remitto_country",
    "remitto_phone",
    "AutoCreditWarnLateCustomers",
    "DefaultAutoCreditWarnGraceDays",
    "DefaultARIncidentStatus",
    "AutoCloseARIncident",
    "RecurringInvoiceBuffer",
    "DefaultCustType",
    "DefaultSalesRep",
    "DefaultShipViaId",
    "DefaultTerms",
    "DefaultBalanceMethod",
    "DefaultPartialShip",
    "DefaultBackOrders",
    "DefaultFreeFormShiptos",
    "SOCreditLimit",
    "SOCreditRate",
    "InvcNumberGeneration"
  ]

  /* 
  Return Billing configuration settings.

  @returns {Object}
  */
  XM.Billing.settings = function() {
    var keys = XM.Billing.options.slice(0),
        data = Object.create(XT.Data),
        sql = "select orderseq_number as value "
            + "from orderseq"
            + " where (orderseq_name=$1)",
        cnum = {}, inum = {}, ret = [];

    cnum.setting = 'NextARMemoNumber';
    cnum.value = plv8.execute(sql, ['ARMemoNumber'])[0].value;
    ret.push(cnum);

    inum.setting = 'NextCashRcptNumber';
    inum.value = plv8.execute(sql, ['CashRcptNumber'])[0].value;
    ret.push(inum);

    ret = ret.concat(data.retrieveMetrics(keys));
    
    return ret;
  }

  /* 
  Update Billing configuration settings. Only valid options as defined in the array
  XM.Billing.options will be processed.

   @param {Object} settings
   @returns {Boolean}
  */
  XM.Billing.commitSettings = function(settings) {
    var sql, options = XM.Billing.options.slice(0),
        data = Object.create(XT.Data), metrics = {};

    /* check privileges */
    if(!data.checkPrivilege('ConfigureGL')) throw new Error('Access Denied');

    /* update numbers */
    if(settings['NextARMemoNumber']) {
      plv8.execute('select setNextARMemoNumber($1)', [settings['NextARMemoNumber']]);
    }
    options.remove('NextARMemoNumber');

    if(settings['NextCashRcptNumber']) {
      plv8.execute('select setNextCashRcptNumber($1)', [settings['NextCashRcptNumber']]);
    }
    options.remove('NextCashRcptNumber');

    /* update address as a real address */
    sql = "select saveAddr(null,null,$1,$2,$3,$4,$5,$6,$7,'CHANGEONE')";
    plv8.execute(sql, [settings['remitto_address1'] ? settings['remitto_address1'] : '',
                     settings['remitto_address2'] ? settings['remitto_address2'] : '',
                     settings['remitto_address3'] ? settings['remitto_address3'] : '',
                     settings['remitto_city'] ? settings['remitto_city'] : '',
                     settings['remitto_state'] ? settings['remitto_state'] : '',
                     settings['remitto_zipcode'] ? settings['remitto_zipcode'] : '',
                     settings['remitto_country'] ? settings['remitto_country'] : '']);

    /* update remaining options as metrics.
       first make sure we pass an object that only has valid metric options for this type */
    for(var i = 0; i < options.length; i++) {
      var prop = options[i];
      if(settings[prop] !== undefined) metrics[prop] = settings[prop];
    }
 
    return data.commitMetrics(metrics);
  }

  XT.registerSettings('XM','Billing','settings');

$$ );

