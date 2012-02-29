select xt.install_js('XM','Payable','xtuple', $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */
  
  XM.Payable = {};

  XM.Payable.isDispatchable = true,

  /**
   Approve a payable for payment.

   @param {Number} Payable 
   @param {Number} BankAccount
   @returns {Boolean} 
  */
  XM.Payable.approve = function(payableId, bankAccountId) {
    var ret, sql, err,
        data = Object.create(XT.Data);

    if(!data.checkPrivilege("MaintainPayments")) err = "Access denied."
    else if(payableId === undefined) err = "No payable specified";
    else if(bankAccountId === undefined) err = "No bank account specified";

    if(!err) {
      ret = executeSql("select selectPayment($1, $2) AS result;", [payableId, bankAccountId])[0].result;

      switch (ret)
      {
        case -1: 
          err = "Invalid payable.";
          break;
        case -2:
          err = "Payable does not have an open balance.";
          break;
        default:
          return ret;   
      }
    }
    
    throw new Error(err);
  }

$$ );

