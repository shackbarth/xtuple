select xt.install_js('XM','ledger','ledger', $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */
  
  XM.Ledger = {};

  XM.Ledger.isDispatchable = true,

  XM.Ledger.options = [
    "GLMainSize",
    "GLCompanySize",
    "YearEndEquityAccount",
    "CurrencyGainLossAccount",
    "GLSeriesDiscrepancyAccount",
    "GLProfitSize",
    "GLFFProfitCenters",
    "GLSubaccountSize",
    "GLFFSubaccounts",
    "UseJournals",
    "CurrencyExchangeSense",
    "MandatoryGLEntryNotes",
    "ManualForwardUpdate",
    "InterfaceToGL"
  ]

  /* 
  Return Ledger configuration settings.

  @returns {Object}
  */
  XM.Ledger.settings = function() {
    var keys = XM.GeneralLedger.options.slice(0),
        data = Object.create(XT.Data);
    
    return data.retrieveMetrics(keys);
  }

  /* 
  Update Ledger configuration settings. Only valid options as defined in the array
  XM.Ledger.options will be processed.

  @param {Object} settings
  @returns {Boolean}
  */
  XM.Ledger.commitSettings = function(settings) {
    var sql, options = XM.GeneralLedger.options.slice(0),
        data = Object.create(XT.Data), metrics = {};

    /* check privileges */
    if(!data.checkPrivilege('ConfigureGL')) throw new Error('Access Denied');

    /* update options as metrics.
       first make sure we pass an object that only has valid metric options for this type */
    for(var i = 0; i < options.length; i++) {
      var prop = options[i];
      if(settings[prop] !== undefined) metrics[prop] = settings[prop];
    }
 
    return data.commitMetrics(metrics);
  }

  XT.registerSettings('XM','Ledger','settings');

$$ );
