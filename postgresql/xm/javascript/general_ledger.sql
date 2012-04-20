select xt.install_js('XM','GeneralLedger','xtuple', $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */
  
  XM.GeneralLedger = {};

  XM.GeneralLedger.isDispatchable = true,

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
