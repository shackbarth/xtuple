select xt.install_js('XM','Voucher','xtuple', $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  XM.Voucher = {};
  
  XM.Voucher.isDispatchable = true;
  
  /** 
   Posts the selected open voucher to the payables sub-ledger

   @param {Number} Voucher ID (optional)
   @returns {Number}
  */
  XM.Voucher.post = function(voucherId) {
    var data, ret, err;

    data = Object.create(XT.Data);
    if(!data.checkPrivilege('PostVouchers')) err = "Access Denied.";
    else if(voucherId === undefined) err = "No Voucher specified.";
    if(!err) {
      ret = plv8.execute("select postvoucher($1, false) as result;", [voucherId])[0].result;

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
          break;
        default:
          return ret;
      }

    }

    throw new Error(err);
  }
  
  /** 
   Posts all open vouchers to the payables sub-ledger

   @param {Number} Voucher ID (optional)
   @returns {Number}
  */
  XM.Voucher.postAll = function() {
    var data, ret, err;

    data = Object.create(XT.Data);
    if(!data.checkPrivilege('PostVouchers')) err = "Access Denied.";

    if(!err) {
      ret = plv8.execute("select postvouchers(false) as result;")[0].result;

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
          break;
        default:
          return ret;
      }

    }

    throw new Error(err);
  }
  
  /** 
   Voids a voucher that has already been posted to the payables sub-ledger

   @param {Number} Voucher ID
   @returns {Number}
  */
  XM.Voucher.void = function(apOpenId) {
    var data, err;

    data = Object.create(XT.Data);
    if(!data.checkPrivilege('VoidPostedVouchers')) err = "Access Denied.";
    else if(voucherId === undefined) err = "No voucher specified";

    if(!err) {
      return plv8.execute("select voidapopenvoucher($1) as result;", [apOpenId])[0].result;
    }

    throw new Error(err);
  }

  /** 
   Create 1 or more recurring Vouchers

   @param {Number} VoucherId
   @returns {Number}
  */
  XM.Voucher.createRecurring = function(voucherId) {
    var sql = "select createrecurringitems({id}, 'V') as result;"
              .replace(/{id}/, voucherId === undefined ? null : voucherId),
        data = Object.create(XT.Data),
        err;

    if(!data.checkPrivilege('MaintainVouchers'))
      err = "Access Denied.";

    if(!err) {
      return plv8.execute(sql)[0].result;
    }

    throw new Error(err);
  }

$$ );

