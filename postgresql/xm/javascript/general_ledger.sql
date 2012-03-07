select xt.install_js('XM','generalLedger','generalLedger', $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */
  
  XM.GeneralLedger = {};

  XM.GeneralLedger.isDispatchable = true,

  XM.GeneralLedger.options = [
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
  Return GeneralLedger configuration settings.

  @returns {Object}
  */
  XM.GeneralLedger.settings = function() {
    var keys = XM.GeneralLedger.options,
        data = Object.create(XT.Data);
    
    return data.retrieveMetrics(keys);
  }

  /* 
  Update GeneralLedger configuration settings. Only valid options as defined in the array
  XM.GeneralLedger.options will be processed.

  @param {Object} settings
  @returns {Boolean}
  */
  XM.GeneralLedger.commitSettings = function(settings) {
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

  XT.registerSettings('XM','GeneralLedger','settings');

  /** 
   Delete General Ledger entries by series.

   The notes param allows the client to append info
   about the delete transaction.

   @param {Number, String} seriesId, notes
   @returns {Boolean}
  */
  XM.GeneralLedger.delete = function(seriesId, notes) {
    var data = Object.create(XT.Data),
        ret, err;

    if(!data.checkPrivilege('ViewGLTransactions') && !data.checkPrivilege('DeletePostedJournals'))
      err = "Access Denied.";
    else if(seriesId === undefined)
      err = "Series Number required.";
    else if(notes === undefined)
      notes = '';

    if(!err) {
      return executeSql("select deleteglseries($1, $2) as result;", [seriesId, notes])[0].result;
    }

    throw new Error(err);
  }

  /** 
   Reverse General Ledger entries by series.

   The notes param allows the client to append info
   about the delete transaction.

   @param {Number, Date, String} seriesId, distributionDate, notes
   @returns {Number}
  */
  XM.GeneralLedger.reverse = function(seriesId, distributionDate, notes) {
    var data = Object.create(XT.Data),
        ret, err;

    if(!data.checkPrivilege('ViewGLTransactions') && !data.checkPrivilege('PostStandardJournals') && !data.checkPrivilege('EditPostedJournals'))
      err = "Access Denied.";
    else if(seriesId === undefined)
      err = "Series Number required.";
    else if(distributionDate === undefined)
      err = "Distribution Date required.";
    else if(notes === undefined)
      notes = '';

    if(!err) {
      return executeSql("select deleteglseries($1, $2, $3) as result;", [seriesId, distributionDate, notes])[0].result;
    }

    throw new Error(err);
  }

$$ );