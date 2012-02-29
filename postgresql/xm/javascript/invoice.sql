select xt.install_js('XM','Invoice','xtuple', $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  XM.Invoice = {};
  
  XM.Invoice.isDispatchable = true;
  
	XM.Invoice.post = function(invoiceId) {
	/**
	 Post a invoice.

	 @param {Number} Invoice ID 
	 @returns {Number} 
	*/
	  var ret, sql, err,
			  data = Object.create(XT.Data);

	  if(!data.checkPrivilege("PostMiscInvoices")) err = "Access denied."
	  else if(invoiceId === undefined) err = "No Invoice specified";

	  if(!err) {
			ret = executeSql("select postinvoice($1) AS result;", [invoiceId])[0].result;

			switch (ret)
			{
			  case -1: 
					err = "insertIntoGLSeries";
					break;
			  case -4: 
					err = "insertIntoGLSeries";
					break;				
			  case -5: 
					err = "postGLSeries";
					break;
			  case -10: 
					err = "Unable to post this Invoice because it has already been posted.";
					break;
			  case -11:
					err = "Unable to post this Invoice because the Sales Account was not found.";
					break;
			  case -12:
					err = "Unable to post this Invoice because there was an error processing Line Item taxes.";
					break;
			  case -13: 
					err = "Unable to post this Invoice because there was an error processing Misc. Line Item taxes.";
					break;
			  case -14: 
					err = "Unable to post this Invoice because the Freight Account was not found.";
					break;				
			  case -15: 
					err = "Unable to post this Invoice because there was an error processing Freight taxes.";
					break;
			  case -16: 
					err = "Unable to post this Invoice because there was an error processing Tax Adjustments.";
					break;
			  case -17:
					err = "Unable to post this Invoice because the A/R Account was not found.";
					break;				
			  default:
					return ret;	  
			}
	  }

	  throw new Error(err);
	}

	XM.Invoice.void = function(invoiceId) {
  /**
   Void a invoice.

   @param {Number} Invoice ID 
   @returns {Number} 
  */
	  var ret, sql, err,
			  data = Object.create(XT.Data);

	  if(!data.checkPrivilege("VoidPostedInvoices")) err = "Access denied."
	  else if(invoiceId === undefined) err = "No Invoice specified";

	  if(!err) {
			ret = executeSql("select voidinvoice($1) AS result;", [invoiceId])[0].result;

			switch (ret)
			{
			  case -1: 
					err = "insertIntoGLSeries";
					break;
			  case -4: 
					err = "insertIntoGLSeries";
					break;				
			  case -5: 
					err = "postGLSeries";
					break;
			  case -10: 
					err = "Unable to void this Credit Memo because it has not been posted.";
					break;
			  case -11:
					err = "Unable to void this Credit Memo because the Sales Account was not found.";
					break;
			  case -20:
					err = "Unable to void this Credit Memo because there A/R Applications posted against this Credit Memo.";
					break;
			  default:
					return ret;	  
			}
	  }

	  throw new Error(err);
	}  
  
$$ );