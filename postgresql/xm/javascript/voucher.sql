select xt.install_js('XM','Voucher','xtuple', $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  XM.Voucher = {};
  
  XM.Voucher.isDispatchable = true;
  
  XM.Voucher.post = function() {
  /* checks privilege to post then pass id to function postvoucher()

   @param {Object} Voucher object
   @returns {Integer}
  */
    data = Object.create(XT.Data);
    if(!data.checkPrivilege('PostVouchers')) throw new Error("Access Denied");
    var args = arguments[0];
    
    if args.id === undefined return executeSql('select postVoucher(false) as result')[0].result;

    return executeSql('select postVoucher($1, fetchJournalNumber('AP-VO'), false) as result', [args.id])[0].result;
    
  }
  
  XM.Voucher.void = function() {
  /* checks privilege to void then pass id to function voidapopenvoucher()

   @param {Object} Voucher object
   @returns {Integer}
  */
    data = Object.create(XT.Data);
    if(!data.checkPrivilege('VoidPostedVouchers')) throw new Error("Access Denied");
    var args = arguments[0];
    
    return executeSql('select voidapopenvoucher($1, fetchJournalNumber('AP-VO')) as result', [args.id])[0].result;
  }  
  
$$ );
