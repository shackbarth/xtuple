select xt.install_js('XM','CashReceipt','xtuple', $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xtuple.com/CPAL for the full text of the software license. */

  XM.CashReceipt = {};
  
  XM.CashReceipt.isDispatchable = true;
  
	XM.CashReceipt.post = function(cashReceiptId) {
	/**
	 Post a cash receipt.

	 @param {Number}
	 @returns {Number} 
	*/
	  var ret, sql, err,
			  data = Object.create(XT.Data);

	  if(!data.checkPrivilege("PostCashReceipts")) err = "Access denied."
	  else if(cashReceiptId === undefined) err = "No Invoice specified";

	  if(!err) {
			ret = executeSql("select postcashreceipt($1, fetchJournalNumber('C/R')) AS result;", [cashReceiptId])[0].result;

			switch (ret)
			{
			  case -1: 
					err = "The selected Cash Receipt cannot be posted as the amount distributed is greater than the amount received. You must correct this before you may post this Cash Receipt.";
					break;
			  case -2: 
					err = "The selected Cash Receipt cannot be posted as the amount received must be greater than zero. You must correct this before you may post this Cash Receipt.";
					break;				
			  case -5: 
					err = "The selected Cash Receipt cannot be posted as the A/R Account cannot be determined. You must make an A/R Account Assignment for the Customer Type to which this Customer is assigned before you may post this Cash Receipt.";
					break;
			  case -6: 
					err = "The selected Cash Receipt cannot be posted as the Bank Account cannot be determined. You must make a Bank Account Assignment for this Cash Receipt before you may post it.";
					break;
			  case -7:
					err = "The selected Cash Receipt cannot be posted, probably because the Customer's Prepaid Account was not found.";
					break;
			  case -8:
					err = "Cannot post this Cash Receipt because the credit card records could not be found.";
					break;				
			  default:
					return ret;	  
			}
	  }

	  throw new Error(err);
	}
	
	XM.Invoice.postAll = function(cashReceiptId) {
	/**
	 Post a All cash receipts.

	 @param {number}
	 @returns {boolean} 
*/
	  var ret, sql, err,
			  data = Object.create(XT.Data);

	  if(!data.checkPrivilege("PostCashReceipts")) err = "Access denied."
	  else if(cashReceiptId === undefined) err = "Post unprinted not defined";

	  if(!err) {
			ret = executeSql("select postinvoices($1) AS result;", [cashReceiptId])[0].result;

			return ret;
	  }

	  throw new Error(err);
	}

	XM.Invoice.void = function(cashReceiptId) {
  /**
   Void a cash receipt.

   @param {Number}
   @returns {Number} 
  */
	  var ret, sql, err,
			  data = Object.create(XT.Data);

	  if(!data.checkPrivilege("VoidPostedCashReceipts")) err = "Access denied."
	  else if(cashReceiptId === undefined) err = "No Invoice specified";

	  if(!err) {
			ret = executeSql("select reversecashreceipt($1, fetchJournalNumber('C/R')) AS result;", [cashReceiptId])[0].result;

			switch (ret)
			{
			  case -1: 
					err = "Cannot add to a G/L Series because the Account is NULL or -1.";
					break;
			  case -4: 
					err = "Cannot add to a G/L Series because the Account is NULL or -1.";
					break;				
			  case -5: 
					err = "Could not post this G/L Series because the G/L Series Discrepancy Account was not found.";
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