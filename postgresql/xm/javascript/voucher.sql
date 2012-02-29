select xt.install_js('XM','Voucher','xtuple', $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  XM.Voucher = {};
  
  XM.Voucher.isDispatchable = true;
  
  /** 
   Posts 1 or more vouchers to the payables sub-ledger

   @param {Number} Voucher ID (optional)
   @returns {Number}
  */
  XM.Voucher.post = function(voucherId) {
    var data, ret, err;

    data = Object.create(XT.Data);
    if(!data.checkPrivilege('PostVouchers')) err = "Access Denied.";

    if(!err) {
      if(voucherId === undefined) ret = executeSql("select postvoucher(false) as result;")[0].result;

      else ret = executeSql("select postvoucher($1, false) as result;", [voucherId])[0].result;
    }

    switch (ret)
    {
      case -5:
        err = "The Cost Category for one or more Item Sites "
              + "for the Purchase Order covered by this Voucher "
              + "is not configured with Purchase Price Variance "
              + "or P/O Liability Clearing Account Numbers or "
              + "the Vendor of this Voucher is not configured "
              + "with an A/P Account Number. Because of this, "
              + "G/L Transactions cannot be posted for this "
              +"Voucher.";
      default:
        return ret;
    }

    throw new Error(err);
  }
  
  /** 
   Voids a voucher that has already been posted to the payables sub-ledger

   @param {Number} Voucher ID
   @returns {Number}
  */
  XM.Voucher.void = function(voucherId) {
    var data, ret, err;

    data = Object.create(XT.Data);
    if(!data.checkPrivilege('VoidPostedVouchers')) err = "Access Denied.";
    else if(voucherId === undefined) err = "No voucher specified";

    if(!err) {
      ret = executeSql("select voidapopenvoucher($1) as result;", [voucherId])[0].result;
    }

    switch (ret)
    {
      case -5:
        err = "The Cost Category for one or more Item Sites "
              + "for the Purchase Order covered by this Voucher "
              + "is not configured with Purchase Price Variance "
              + "or P/O Liability Clearing Account Numbers or "
              + "the Vendor of this Voucher is not configured "
              + "with an A/P Account Number. Because of this, "
              + "G/L Transactions cannot be posted for this "
              +"Voucher.";
      default:
        return ret;
    }

    throw new Error(err);
  }

$$ );
