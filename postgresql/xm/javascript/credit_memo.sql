select xt.install_js('XM','CreditMemo','xtuple', $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */


  XM.CreditMemo = {};
  
  XM.CreditMemo.isDispatchable = true;
  
  XM.CreditMemo.post = function() {
  /* check privilege to post credit memo than pass id and item loc to function postcreditmemo()
   
   @param {Object} Invoice object
   @returns {Integer}
  */
    data = Object.create(XT.Data);
    if(!data.checkPrivilege('PostARDocuments')) throw new Error("Access Denied");
    var args = arguments[0];
    
    return executeSql('select postcreditmemo($1,$2) as result', [args.id])[0].result;
  }
  
  XM.CreditMemo.void = function() {
  /* check privilege to void credit memo than pass id to function voidcreditmemo

   @param {Object} Invoice object
   @returns {Integer}
  */
    data = Object.create(XT.Data);
    if(!data.checkPrivilege('VoidPostedARCreditMemos')) throw new Error("Access Denied");
    var args = arguments[0];
    
    return executeSql('select voidcreditmemo($1) as result', [args.id])[0].result;
  }  
  
$$ );