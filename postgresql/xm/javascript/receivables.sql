select xt.install_js('XM','receivables','xtuple', $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */
  
  XM.Receivables = {};

  XM.Receivables.isDispatchable = true,

  XM.Receivables.options = [
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
    "RecurringInvoiceBuffer"
  ]

  /* 
  Update Receivables configuration settings. Only valid options as defined in the array
  XM.Receivables.options will be processed.

   @param {Object} settings
   @returns {Boolean}
  */
  XM.Receivables.updateSettings = function(settings) {
    var sql, options = XM.Receivables.options.slice(0),
        data = Object.create(XT.Data), metrics = {};

    /* check privileges */
    if(!data.checkPrivilege('ConfigureGL')) throw new Error('Access Denied');

    /* update numbers */
    if(settings['NextARMemoNumber']) {
      executeSql('select setNextARMemoNumber($1)', [settings['NextARMemoNumber']]);
    }
    options.remove('NextARMemoNumber');

    if(settings['NextCashRcptNumber']) {
      executeSql('select setNextCashRcptNumber($1)', [settings['NextCashRcptNumber']]);
    }
    options.remove('NextCashRcptNumber');

    /* update address as a real address */
    sql = "select saveAddr(null,null,$1,$2,$3,$4,$5,$6,$7,'CHANGEONE')";
    executeSql(sql, [settings['remitto_address1'] ? settings['remitto_address1'] : '',
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
      if(settings[prop]) metrics[prop] = settings[prop];
    }
 
    return data.commitMetrics(metrics);
  }

$$ );

