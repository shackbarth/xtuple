select xt.install_js('XM','CreditMemo','xtuple', $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. 
     
     Not Working Still need to run test and pass all correct number of params
     
     */

  XM.CreditMemo = {};
  
  XM.CreditMemo.isDispatchable = true;
  
  XM.CreditMemo.post = function() {
  /* On post it has to pass to integers
		Pass 2 args both integer
   @param {Object} Invoice object
   @returns {Integer}
  */
    data = Object.create(XT.Data);
    if(!data.checkPrivilege('PostARDocuments')) throw new Error("Access Denied");
    var args = arguments[0];
    
    return executeSql('select postcreditmemo($1,$2) as result', [args.id])[0].result;
  }
  
  XM.CreditMemo.void = function() {
  /* Check privilege than void invoice set is_void to true

   @param {Object} Invoice object
   @returns {Integer}
  */
    data = Object.create(XT.Data);
    if(!data.checkPrivilege('VoidPostedARCreditMemos')) throw new Error("Access Denied");
    var args = arguments[0];
    
    return executeSql('select voidcreditmemo($1) as result', [args.id])[0].result;
  }  
  
$$ );