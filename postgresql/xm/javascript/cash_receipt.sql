select xt.install_js('XM','CashReceipt','xtuple', $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  XM.CashReceipt = {};
  
  XM.CashReceipt.isDispatchable = true;
  
  XM.CashReceipt.post = function() {
  /* check privilege to post cash receipt than pass id and journal number to function postcashreceipt()
  
   @param {Object} Invoice object
   @returns {Integer}
  */
    data = Object.create(XT.Data);
    if(!data.checkPrivilege('PostCashReceipts')) throw new Error("Access Denied");
    var args = arguments[0];
    
    return executeSql('select postcashreceipt($1, fetchJournalNumber('C/R')) AS result', [args.id])[0].result;
  }
  
  XM.CashReceipt.void = function() {
  /* check privilege to void cash receipts than pass id and journal number to function reverseCashReceipt
   @param {Object} Invoice object
   @returns {Integer} 
  */
    data = Object.create(XT.Data);
    if(!data.checkPrivilege('VoidPostedCashReceipts')) throw new Error("Access Denied");
    var args = arguments[0];
    
    return executeSql('select reversecashreceipt($1, fetchJournalNumber('C/R')) AS result', [args.id])[0].result;
  }  
  
$$ );