select xt.install_js('XM','Invoice','xtuple', $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  XM.Invoice = {};
  
  XM.Invoice.isDispatchable = true;
  
  XM.Invoice.post = function() {
  	/* Post Invoice 
  		First check privileges than post the invoice
  		
  		
  		public.function postinvoice() 
  		
  		Question: In public functions there is 5 functions for postinvoice 3 pass integers and the other 2 pass boolean which one do I use
  					for this function??
  	*/
  	
  	/* Checks privileges 
  		Check to make sure that MaintainMiscInvoices is the correct name for that privilege
  	*/
  	data = Object.create(XT.Data);
	if(!data.checkPrivilege('MaintainMiscInvoices')) throw new Error("Access Denied");
  	
  }
  
  XM.Invoice.isVoid = function() {
  	/* Void Invoice 
  		Set void to true passing booleans values
  		
  		public.function voidinvoice() 1 param integer
  	*/
  	
  }  
  
$$ );