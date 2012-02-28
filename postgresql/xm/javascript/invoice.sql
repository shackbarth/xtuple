select xt.install_js('XM','Invoice','xtuple', $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  XM.Invoice = {};
  
  XM.Invoice.isDispatchable = true;
  
  XM.Invoice.post = function() {
  /* checks privilege to post than pass id to function postinvoice()

   @param {Object} Invoice object
   @returns {Integer}
  */
    data = Object.create(XT.Data);
    if(!data.checkPrivilege('PostMiscInvoices')) throw new Error("Access Denied");
    var args = arguments[0];
    
    return executeSql('select postinvoice($1) as result', [args.id])[0].result;
  }
  
  XM.Invoice.void = function() {
  /* checks privilege to void than pass id to function voidinvoice()

   @param {Object} Invoice object
   @returns {Integer}
  */
    data = Object.create(XT.Data);
    if(!data.checkPrivilege('VoidPostedInvoices')) throw new Error("Access Denied");
    var args = arguments[0];
    
    return executeSql('select voidinvoice($1) as result', [args.id])[0].result;
  }  
  
$$ );