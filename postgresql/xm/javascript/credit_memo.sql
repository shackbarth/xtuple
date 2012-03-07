select xt.install_js('XM','CreditMemo','xtuple', $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xtuple.com/CPAL for the full text of the software license. */

  XM.CreditMemo = {};
  
  XM.CreditMemo.isDispatchable = true;
  
	XM.CreditMemo.post = function(creditMemoId,itemLocSeries) {
	/**
	 Post a cash receipt.

	 @param {Number}
	 @returns {Number} 
	*/
	  var ret, sql, err,
			  data = Object.create(XT.Data);

	  if(!data.checkPrivilege("PostARDocuments")) err = "Access denied."
	  else if(creditMemoId === undefined) err = "Not specified";
	  else if(itemLocSeries === undefined) err = "Not specified";
	
	  if(!err) {
			ret = executeSql("select postcreditmemo($1, $2) AS result;", [creditMemoId,itemLocSeries])[0].result;

			switch (ret)
			{
			  case -10: 
					err = "This Credit Memo cannot be posted because it has already been posted.";
					break;
			  case -11: 
					err = "This Credit Memo is on Hold and, thus, cannot be posted.";
					break;				
			  case -12: 
					err = "The Sales Account Assignment for this Credit Memo is not configured correctly. Because of this, G/L Transactions cannot be posted for this Credit Memo. You must contact your Systems Administrator to have this corrected before you may post this Credit Memo.";
					break;
			  case -14: 
					err = "The Misc. Charge Account Assignment for this Credit Memo is not configured correctly. Because of this, G/L Transactions cannot be posted for this Credit Memo. You must contact your Systems Administrator to have this corrected before you may post this Credit Memo.";
					break;
			  case -16:
					err = "The Freight Account Assignment for this Credit Memo is not configured correctly. Because of this, G/L Transactions cannot be posted for this Credit Memo. You must contact your Systems Administrator to have this corrected before you may post this Credit Memo.";
					break;
			  case -18:
					err = "The A/R Account Assignment for this Credit  Memo is not configured correctly. Because of this, G/L Transactions cannot be posted for this Credit Memo. You must contact your Systems Administrator to have this corrected before you may post this Credit Memo.";
					break;				
			  default:
					return ret;	  
			}
	  }

	  throw new Error(err);
	}
	
	XM.CreditMemo.postAll = function(postUnprinted) {
	/**
	 Post a All cash receipts.

	 @param {number}
	 @returns {boolean} 
*/
	  var ret, sql, err,
			  data = Object.create(XT.Data);

	  if(!data.checkPrivilege("PostCashReceipts")) err = "Access denied."
	  else if(postUnprinted === undefined) err = "Note defined";

	  if(!err) {
			ret = executeSql("select postcreditmemos($1) AS result;", [postUnprinted])[0].result;

			return ret;
	  }

	  throw new Error(err);
	}

	XM.CreditMemo.void = function(creditMemosId) {
  /**
   Void a cash receipt.

   @param {Number}
   @returns {Number} 
  */
	  var ret, sql, err,
			  data = Object.create(XT.Data);

	  if(!data.checkPrivilege("VoidPostedARCreditMemos")) err = "Access denied."
	  else if(creditMemosId === undefined) err = "No Invoice specified";

	  if(!err) {
			ret = executeSql("select voidcreditmemo($1) AS result;", [creditMemosId])[0].result;

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