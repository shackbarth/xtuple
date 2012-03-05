select xt.install_js('XM','BankAccountReconciliation','xtuple', $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  XM.BankAccountReconciliation = {};
  
  XM.BankAccountReconciliation.isDispatchable = true;
  
  /** 
   Close an accounting year period.

   @param {Number} periodId
   @returns {Number}
  */
  XM.BankAccountReconciliation.close = function(bankRecId) {
    var data, ret, err;

    data = Object.create(XT.Data);
    if(!data.checkPrivilege('MaintainBankRec')) err = "Access Denied.";

    if(!err) {
      ret = executeSql("select postbankreconciliation($1) as result;", [bankRecId])[0].result;

      switch (ret)
      {
        case -1:
          err = "This Bank Reconciliation could not be "
                + "posted because the G/L Account could not "
                + "be verified.";
          break;
        default:
          return ret;
      }

    }

    throw new Error(err);
  }

$$ );