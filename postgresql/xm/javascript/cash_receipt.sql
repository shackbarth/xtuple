select xt.install_js('XM','CashReceipt','xtuple', $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. 
     
     Not Working Still need to run test and pass all correct number of params
     
     */

  XM.CashReceipt = {};
  
  XM.CashReceipt.isDispatchable = true;
  
  XM.CashReceipt.post = function() {
  /* On post it has to pass to integers
		Passes in 2 params both integer
   @param {Object} Invoice object
   @returns {Integer}
  */
    data = Object.create(XT.Data);
    if(!data.checkPrivilege('PostCashReceipts')) throw new Error("Access Denied");
    var args = arguments[0];
    
    return executeSql('select postreceipt($1,$2) as result', [args.id])[0].result;
  }
  
  XM.CashReceipt.void = function() {
  /* Check privilege than void invoice set is_void to true
	Pass 2 params integer for both
   @param {Object} Invoice object
   @returns {Integer} 
  */
    data = Object.create(XT.Data);
    if(!data.checkPrivilege('VoidPostedCashReceipts')) throw new Error("Access Denied");
    var args = arguments[0];
    
    return executeSql('select reversecashreceipt($1,$2) as result', [args.id])[0].result;
  }  
  
$$ );