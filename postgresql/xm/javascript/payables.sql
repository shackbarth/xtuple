select xt.install_js('XM','payables','payables', $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */
  
  XM.Payables = {};

  XM.Payables.isDispatchable = true,

  XM.Payables.options = [
    "NextAPMemoNumber",
    "ACHEnabled",
    "ACHCompanyId",
    "ACHCompanyIdType",
    "ACHCompanyName",
    "ACHDefaultSuffix",
    "EFTRoutingRegex",
    "EFTAccountRegex",
    "EFTFunction",
    "NextACHBatchNumber",
    "ReqInvRegVoucher",
    "ReqInvMiscVoucher",
    "RecurringVoucherBuffer"
  ]

  /* 
  Return Payables configuration settings.

  @returns {Object}
  */
  XM.Payables.settings = function() {
    var keys = XM.Payables.options,
        data = Object.create(XT.Data),
        sql = "select orderseq_number as value "
            + "from orderseq"
            + " where (orderseq_name=$1)",
        cnum = {}, inum = {}, ret = [];

    cnum.setting = 'NextAPMemoNumber';
    cnum.value = executeSql(sql, ['APMemoNumber'])[0].value;
    ret.push(cnum);

    inum.setting = 'NextACHBatchNumber';
    inum.value = executeSql(sql, ['ACHBatch'])[0].value;
    ret.push(inum);

    ret = ret.concat(data.retrieveMetrics(keys));
    
    return ret;
  }

  /* 
  Update Payables configuration settings. Only valid options as defined in the array
  XM.Payables.options will be processed.

   @param {Object} settings
   @returns {Boolean}
  */
  XM.Payables.commitSettings = function(settings) {
    var sql, options = XM.Payables.options.slice(0),
        data = Object.create(XT.Data), metrics = {};

    /* check privileges */
    if(!data.checkPrivilege('ConfigureGL')) throw new Error('Access Denied');

    /* update numbers */
    if(settings['NextAPMemoNumber']) {
      executeSql('select setNextAPMemoNumber($1)', [settings['NextAPMemoNumber']]);
    }
    options.remove('NextAPMemoNumber');

    if(settings['NextACHBatchNumber']) {
      executeSql("select setNextNumber('ACHBatch', $1)", [settings['NextACHBatchNumber']]);
    }
    options.remove('NextACHBatchNumber');

    /* update remaining options as metrics.
       first make sure we pass an object that only has valid metric options for this type */
    for(var i = 0; i < options.length; i++) {
      var prop = options[i];
      if(settings[prop] !== undefined) metrics[prop] = settings[prop];
    }
 
    return data.commitMetrics(metrics);
  }

  XT.registerSettings('XM','Payables','settings');

$$ );

