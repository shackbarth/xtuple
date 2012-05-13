select xt.install_js('XM','FiscalYear','xtuple', $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  XM.FiscalYear = {};
  
  XM.FiscalYear.isDispatchable = true;
  
  /** 
   Close an accounting year period.

   @param {Number} periodId
   @returns {Number}
  */
  XM.FiscalYear.close = function(periodId) {
    var data, ret, err;

    data = Object.create(XT.Data);
    if(!data.checkPrivilege('MaintainAccountingPeriods')) err = "Access Denied.";

    if(!err) {
      ret = plv8.execute("select closeaccountingyearperiod($1) as result;", [periodId])[0].result;

      switch (ret)
      {
        case -1:
          err = "The selected Accounting Period cannot be "
                + "closed because it is already closed.";
          break;
        case -2:
          err = "The selected Accounting Period cannot be "
                + "closed because there is a gap between the "
                + "end of the previous Period and the start "
                + "of this Period. You must edit either the "
                + "previous Perod or this Period to "
                + "eliminate the gap.";
          break;
        case -3:
          err = "The selected Accounting Period cannot be "
                + "closed because the previous Period is not "
                + "closed. You must close the previous Period"
                + " before you may close this Period.";
          break;
        case -4:
          err = "The selected Accounting Period cannot be "
                + "closed because there is a gap between the "
                + "end of this Period and the start of the "
                + "next Period. You must edit either this "
                + "Period or the next Period to eliminate "
                + "the gap.";
          break;
        case -5:
          err = "The selected Accounting Period cannot be "
                + "closed because it ends in the future.";
          break;
        case -6:
          err = "The selected Accounting Period cannot be "
                + "closed because it is the last period in "
                + "the Fiscal Year and the next Fiscal Year "
                + "has not been defined yet. Create the "
                + "next Fiscal Year before closing this "
                + "Accounting Period.";
          break;
        case -7:
          err = "The selected Fiscal Year cannot be closed "
                + "because you have not specified a Year End Equity Account "
                + "in the accounting configuration.";
          break;
        case -8:
          err = "The selected Fiscal Year cannot be "
                + "closed because there does not seem to "
                + "be an Accounting Period defined for "
                + "the beginning of the next Fiscal "
                + "Year.";
          break;
        case -9:
          err = "The selected Fiscal Year cannot be closed "
                + "because there is no Trial Balance record for "
                + "the account in the required Period. Or you have "
                + "not specified a Year End Equity Account in the "
                + "accounting configuration.";
          break;
        case -10:
          err = "The selected Fiscal Year cannot be closed "
                + "because there are periods within the year that are still open.";
          break;
        case -11:
          err = "The selected Fiscal Year cannot be closed "
                + "because there are prior years that are still open.";
          break;
        default:
          return ret;
      }

    }

    throw new Error(err);
  }

  /** 
   Open an accounting year period.

   @param {Number} periodId
   @returns {Number}
  */
  XM.FiscalYear.open = function(periodId) {
    var data, ret, err;

    data = Object.create(XT.Data);
    if(!data.checkPrivilege('MaintainAccountingPeriods')) err = "Access Denied.";

    if(!err) {
      ret = plv8.execute("select openaccountingyearperiod($1) as result;", [periodId])[0].result;

      switch (ret)
      {
        case -1:
          err = "Cannot open this Accounting Period because "
                + "it is already open.";
          break;
        case -2:
          err = "Cannot open this Accounting Year because "
                + "subsequent years are closed.";
          break;
        default:
          return ret;
      }

    }

    throw new Error(err);
  }

$$ );

