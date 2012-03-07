select xt.install_js('XM','Payable','xtuple', $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */
  
  XM.Payable = {};

  XM.Payable.isDispatchable = true,

  XM.Payable.SELECT_ALL_VENDORS = 0,
  XM.Payable.SELECT_VENDOR = 1,
  XM.Payable.SELECT_VENDOR_TYPE = 2,
  XM.Payable.SELECT_VENDOR_TYPE_PATTERN = 3,

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

  /**
   Approve all due open items for payment.

   @param {Number} targetType 
   @param {Number} target
   @param {Number} BankAccount
   @returns {Boolean} 
  */
  XM.Payable.approveAllDue = function(targetType, target, bankAccountId) {
    var sql = "select selectDueItemsForPayment(vend_id, {bankAccnt}) as result from vendinfo where {conditions};",
        data = Object.create(XT.Data)
        ret, err;

    if(!data.checkPrivilege("MaintainPayments")) err = "Access denied.";
    else if(targetType !== XM.Payable.SELECT_ALL_VENDORS && target === undefined) 
      err = "No Vendor information specified";
    else if(bankAccountId === undefined) err = "No bank account specified";

    if(!err) {
      switch (targetType)
      {
        case XM.Payable.SELECT_ALL_VENDORS: 
          sql = sql.replace(/{bankAccnt}/, bankAccountId)
                   .replace(/{conditions}/, 'true');
          break;
         case XM.Payable.SELECT_VENDOR_TYPE:
          sql = sql.replace(/{bankAccnt}/, bankAccountId)
                   .replace(/{conditions}/, 'vend_vendtype_id = ' + target);
          break;
        case XM.Payable.SELECT_VENDOR_TYPE_PATTERN:
          sql = sql.replace(/{bankAccnt}/, bankAccountId)
                   .replace(/{conditions}/, "vend_vendtype_id in "
                                            + "(select vendtype_id "
                                            + "from vendtype "
                                            + "where vendtype_code ~ " + target + ")");
          break;
        default:
          sql = sql.replace(/{bankAccnt}/, bankAccountId)
                   .replace(/{conditions}/, 'vend_id = ' + target);
      }
      return executeSql(sql)[0].result;
    }
    
    throw new Error(err);
  }

  /**
   Approve all discounted open items for payment.

   @param {Number} targetType 
   @param {Number} target
   @param {Number} BankAccount
   @returns {Boolean} 
  */
  XM.Payable.approveAllDiscounts = function(targetType, target, bankAccountId) {
    var sql = "select selectDiscountItemsForPayment(vend_id, {bankAccnt}) as result from vendinfo where {conditions};",
        data = Object.create(XT.Data)
        ret, err;

    if(!data.checkPrivilege("MaintainPayments")) err = "Access denied.";
    else if(targetType !== XM.Payable.SELECT_ALL_VENDORS && target === undefined) 
      err = "No Vendor information specified";
    else if(bankAccountId === undefined) err = "No bank account specified";

    if(!err) {
      switch (targetType)
      {
        case XM.Payable.SELECT_ALL_VENDORS: 
          sql = sql.replace(/{bankAccnt}/, bankAccountId)
                   .replace(/{conditions}/, 'true');
          break;
         case XM.Payable.SELECT_VENDOR_TYPE:
          sql = sql.replace(/{bankAccnt}/, bankAccountId)
                   .replace(/{conditions}/, 'vend_vendtype_id = ' + target);
          break;
        case XM.Payable.SELECT_VENDOR_TYPE_PATTERN:
          sql = sql.replace(/{bankAccnt}/, bankAccountId)
                   .replace(/{conditions}/, "vend_vendtype_id in "
                                            + "(select vendtype_id "
                                            + "from vendtype "
                                            + "where vendtype_code ~ " + target + ")");
          break;
        default:
          sql = sql.replace(/{bankAccnt}/, bankAccountId)
                   .replace(/{conditions}/, 'vend_id = ' + target);
      }
      return executeSql(sql)[0].result;
    }
    
    throw new Error(err);
  }

$$ );