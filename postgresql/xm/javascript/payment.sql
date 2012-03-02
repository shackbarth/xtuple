select xt.install_js('XM','Payment','xtuple', $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  XM.Payment = {};
  
  XM.Payment.isDispatchable = true;
  
  /** 
   ...

   @param {Number} Payment ID
   @returns {Number}
  */
  XM.Payment.post = function(paymentId) {
    var data, ret, err;

    data = Object.create(XT.Data);
    if(!data.checkPrivilege('PostPayments')) err = "Access Denied.";
    else if(paymentId === undefined) err = "No payment specified";

    if(!err) {
      ret = executeSql("select postcheck(1$, null) as result;", [paymentId])[0].result;
    }

    switch (ret)
    {
      case -10:
        err = "Cannot post this Check because it has already "
              + "been posted.";
      case -11:
        err = "Cannot post this Check because the recipient "
              + "type is not valid.";
      case -12:
        err = "Cannot post this Check because the Expense "
              + "Category could not be found.";
      case -13:
        err = "Cannot post this Check because the G/L Account "
              + "against which it is to be posted is not valid.";
      default:
        return ret;
    }

    throw new Error(err);
  }
  
  /** 
   ...

   @param {Number} Bank Account ID
   @returns {Number}
  */
  XM.Payment.postAll = function(bankAccountId) {
    var data, ret, err;

    data = Object.create(XT.Data);
    if(!data.checkPrivilege('PostPayments')) err = "Access Denied.";
    else if(bankAccountId === undefined) err = "No bank account specified";

    if(!err) {
      ret = executeSql("select postchecks(1$) as result;", [bankAccountId])[0].result;
    }

    switch (ret)
    {
      case -10:
        err = "Cannot post this Check because it has already "
              + "been posted.";
      case -11:
        err = "Cannot post this Check because the recipient "
              + "type is not valid.";
      case -12:
        err = "Cannot post this Check because the Expense "
              + "Category could not be found.";
      case -13:
        err = "Cannot post this Check because the G/L Account "
              + "against which it is to be posted is not valid.";
      default:
        return ret;
    }

    throw new Error(err);
  }
  
  /** 
   ...

   @param {Number} Payment ID
   @returns {Number}
  */
  XM.Payment.void = function(paymentId, distributionDate) {
    var data, err, ret;

    data = Object.create(XT.Data);
    if(!data.checkPrivilege('MaintainPayments')) err = "Access Denied.";
    else if(paymentId === undefined) err = "No payment specified";

    if(!err) {
      /* check to see if the payment has been posted */
      if(executeSql("select (checkhead_posted) "
                    + "from checkhead "
                    + "where checkhead_id = $1 as result;", [paymentId])[0].result) {
                    
        ret = executeSql("select voidpostedcheck($1, fetchjournalnumber('AP-CK'), coalesce($2, date)) from xm.payment where guid = $1 as result;", [paymentId,distributionDate])[0].result;
      }
      else {
        ret = executeSql("select voidcheck($1) as result;", [paymentId])[0].result;
      }
    }

    switch (ret)
    {
      case -1:
        err = "Cannot void this check because either it has already "
              + "been voided, posted, or replaced, or it has been "
              + "transmitted electronically. If this check has been "
              + "posted, try Void Posted Check with the Check Register "
              + "window."
      default:
        return ret;
    }

    throw new Error(err);
  }

  /** 
   ...

   @param {Number} Bank Account ID
   @returns {Number}
  */
  XM.Payment.voidAll = function(bankAccountId) {
    var data, err, ret;

    data = Object.create(XT.Data);
    if(!data.checkPrivilege('MaintainPayments')) err = "Access Denied.";
    else if(bankAccountId === undefined) err = "No Bank Account specified";

    if(!err) {
      ret = executeSql("select checkhead_id, "
                        + "voidcheck(checkhead_id) as result "
                        + "from checkhead "
                        + "where ((not checkhead_posted) "
                        + "and (not checkhead_replaced) "
                        + "and (not checkhead_deleted) "
                        + "and (not checkhead_void) "
                        + "and (checkhead_bankaccnt_id = $1));", [bankAccountId])[0].result;
    }

    switch (ret)
    {
      case -1:
        err = "Cannot void this check because either it has already "
              + "been voided, posted, or replaced, or it has been "
              + "transmitted electronically. If this check has been "
              + "posted, try Void Posted Check with the Check Register "
              + "window."
      default:
        return ret;
    }

    throw new Error(err);
  }

$$ );