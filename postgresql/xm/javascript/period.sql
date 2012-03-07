select xt.install_js('XM','Period','xtuple', $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  XM.Period = {};
  
  XM.Period.isDispatchable = true;
  
  /** 
   Close accounting period.

   @param {Number} periodId
   @returns {Number}
  */
  XM.Period.close = function(periodId) {
    var data, ret, err;

    data = Object.create(XT.Data);
    if(!data.checkPrivilege('MaintainAccountingPeriods')) err = "Access Denied.";
    else if(periodId === undefined) err = "Not defined";

    if(!err) {
      ret = executeSql("select closeaccountingperiod($1) as result;", [periodId])[0].result;

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
        default:
          return ret;
      }

    }

    throw new Error(err);
  }

  /** 
   Open a accounting period.

   @param {Number} periodId
   @returns {Number}
  */
  XM.Period.open = function(periodId) {
    var data, ret, err;

    data = Object.create(XT.Data);
    if(!data.checkPrivilege('MaintainAccountingPeriods')) err = "Access Denied.";
    else if(periodId === undefined) err = "Not defined";

    if(!err) {
      ret = executeSql("select openaccountingperiod($1) as result;", [periodId])[0].result;

      switch (ret)
      {
        case -1:
          err = "Cannot open this Accounting Period because "
                + "it is already open.";
          break;
        case -2:
          err = "Cannot open this Accounting Period because "
                + "it is frozen.";
          break;
        case -3:
          err = "Cannot open this Accounting Period because "
                + "subsequent periods are closed.";
          break;
        case -4:
          err = "Cannot open this Accounting Period because "
                + "the fiscal year is closed.";
          break;
        default:
          return ret;
      }

    }

    throw new Error(err);
  }

$$ );