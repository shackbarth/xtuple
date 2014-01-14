select xt.install_js('XM','Billing','xtuple', $$
/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
   See www.xtuple.com/CPAL for the full text of the software license. */

(function () {
  var billingOptions = [
    "CCValidDays",
    "InvcNumberGeneration",
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
    "RecurringInvoiceBuffer",
    "DefaultARIncidentStatus",
    "AutoCloseARIncident"
  ],
    i, option;

  if (XM.Billing) {
    for(i = 0; i < billingOptions.length; i++) {
      option = billingOptions[i];
      if(!XM.Billing.options.contains(option)) {
        XM.Billing.options.push(option);
      }
    }

  } else {
    XM.Billing = {};
    XM.Billing.options = billingOptions;
  }

  XM.Billing.isDispatchable = true;

  /**
    Return Billing configuration settings.

    @returns {Object}
  */
  XM.Billing.settings = function() {

    var keys = XM.Billing.options.slice(0),
      data = Object.create(XT.Data),
      ret = {},
      qry,
      orm;

    ret.NextARMemoNumber = plv8.execute('select currentARMemoNumber() as value', [])[0].value;
    ret.NextCashRcptNumber = plv8.execute('select currentCashRcptNumber() as value',[])[0].value;

    ret = XT.extend(data.retrieveMetrics(keys), ret);
    return ret;
  }

  /**
    Update Billing configuration settings. Only valid options as defined in the array
    XM.Billing.options will be processed.

    @param {Object} settings
    @returns {Boolean}
  */
  XM.Billing.commitSettings = function(patches) {
    var sql, settings, options = XM.Billing.options.slice(0),
        data = Object.create(XT.Data), metrics = {};

    /* check privileges */
    if(!data.checkPrivilege('ConfigureAR')) throw new Error('Access Denied');

    /* Compose our commit settings by applying the patch to what we already have */
    settings = XM.Billing.settings();
    if (!XT.jsonpatch.apply(settings, patches)) {
      plv8.elog(NOTICE, 'Malformed patch document');
    }

    if (settings['NextARMemoNumber']) {
      plv8.execute('select setNextARMemoNumber($1)', [settings['NextARMemoNumber'] - 0]);
    }
    options.remove('NextARMemoNumber');

    if (settings['NextCashRcptNumber']) {
      plv8.execute('select setNextCashRcptNumber($1)', [settings['NextCashRcptNumber'] - 0]);
    }
    options.remove('NextCashRcptNumber');

    /* update remaining options as metrics
       first make sure we pass an object that only has valid metric options for this type */
    for(var i = 0; i < options.length; i++) {
      var prop = options[i];
      if(settings[prop] !== undefined) metrics[prop] = settings[prop];
    }

    return data.commitMetrics(metrics);
  }

}());

$$ );
