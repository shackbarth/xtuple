select xt.install_js('XM','Invoice','xtuple', $$
/* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
   See www.xtuple.com/CPAL for the full text of the software license. */

  XM.Invoice = {};

  XM.Invoice.isDispatchable = true;

  /**
   Return estimated freight tax data for an invoice based on input. 

   @param {Number} tax zone id
   @param {Number} currency id
   @param {Date} effective date
   @param {Number} amount
   @returns Number 
  */
  XM.Invoice.calculateFreightTax = function(taxZoneId, effective, currencyId, amount) {
    var ret = {}, sql, res, freightTypeID,
        data = Object.create(XT.Data),
        conditions = 'name = {name}',
        parameters = { name: 'Freight' };
    freightTypeId = data.fetch('XM.TaxType', conditions, parameters)[0].guid;
    res = XM.Tax.calculate(taxZoneId, freightTypeId, effective, currencyId, amount)[0];
    ret.taxCode = res.taxCode;
    ret.tax = res.tax;
    return JSON.stringify(ret);
  }

  /**
   Post an Invoice.

   @param {Number} Invoice id
   @returns Number 
  */
  XM.Invoice.post = function(invoiceId) {
    var ret, sql, err,
        data = Object.create(XT.Data);
    if(!data.checkPrivilege("PostMiscInvoices")) err = "Access denied."
    else if(invoiceId === undefined) err = "No Invoice specified";
    if(!err) {
      ret = executeSql("select postinvoice($1) AS result;", [invoiceId])[0].result;
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

  /**
   Post all unposted invoices.

   @param {Boolean} post unprinted 
   @returns Boolean 
  */	
  XM.Invoice.postAll = function(postUnprinted) {
    var ret, sql, err,
        data = Object.create(XT.Data);
    if(!data.checkPrivilege("PostMiscInvoices")) err = "Access denied."
    if(postUnprinted === undefined) postUnprinted = false;
    if(!err) {
      ret = executeSql("select postinvoices($1) AS result;", [postUnprinted])[0].result;
      return ret;
    }
    throw new Error(err);
  }

  /**
   Void an Invoice.

   @param {Number} invoice id 
   @returns Number
  */
  XM.Invoice.void = function(invoiceId) {
    var ret, sql, err,
        data = Object.create(XT.Data);
    if(!data.checkPrivilege("VoidPostedInvoices")) err = "Access denied."
    else if(invoiceId === undefined) err = "No Invoice specified";
    if(!err) {
      ret = executeSql("select voidinvoice($1) AS result;", [invoiceId])[0].result;
      switch (ret)
      {
        case -1: 
          err = "Cannot post journal because the ledger account is NULL or -1.";
          break;
        case -4: 
          err = "Cannot post journal because the ledger account is NULL or -1.";
          break;				
        case -5: 
          err = "Could not post journal because the discrepancy account was not found.";
          break;
        case -10: 
          err = "Unable to void this invoice because it has not been posted.";
          break;
        case -11:
          err = "Unable to void this invoice because the Sales Account was not found.";
          break;
        case -20:
          err = "Unable to void this invoice because there Receivable Applications posted against this Credit Memo.";
          break;
        default:
          return ret;	  
      }
    }
    throw new Error(err);
  }  

  /** 
   Create recurring Invoices

   @param {Number} invoice id
   @returns Number
  */
  XM.Invoice.createRecurring = function(invoiceId) {
    var sql = "select createrecurringitems({id}, 'I') as result;"
              .replace(/{id}/, invoiceId === undefined ? null : invoiceId),
        data = Object.create(XT.Data),
        err;
    if(!data.checkPrivilege('MaintainMiscInvoicess'))
      err = "Access Denied.";
    if(!err) {
      return executeSql(sql)[0].result;
    }
    throw new Error(err);
  }

  /**
   Purge Invoices.

   @param {date}
   @param {Number}
   @returns Number 
  */
  XM.Invoice.purge = function(cutOffDate, invoiceId) {
    var ret, sql, err,
        data = Object.create(XT.Data);
    if(!data.checkPrivilege("PurgeInvoices")) err = "Access denied."
    else if(cutOffDate === undefined) err = "Not defined";
    else if(invoiceId === undefined) err = "Not defined";
    if(!err) {
      ret = executeSql("select purgeInvoiceRecord($1,$2) AS result;", [cutOffDate, invoiceId])[0].result;
      return ret;
    }
    throw new Error(err);
  }

$$ );