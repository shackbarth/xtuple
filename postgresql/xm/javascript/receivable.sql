select xt.install_js('XM','Receivable','xtuple', $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */
  
  XM.Receivable = {};

  XM.Receivable.isDispatchable = true,
  
  /**
   Commit and post a receivable in a single transaction. Only debit memos and credit memos 
   may be posted with this function.

   @param {Hash} receivable
   @returns {Boolean} 
  */
  XM.Receivable.post = function(receivable) {
    var ret, sql, err,
        docType = receivable.documentType,
        salesCategory = receivable.salesCategory ? receivable.salesCategory : -1,
        ledgerAccount = receivable.ledgerAccount ? receivable.ledgerAccount : -1,
        data = Object.create(XT.Data);

    /* validate */
    if(!data.checkPrivilege("MaintainARMemos")) err = "Access denied.";
    else if(docType !== 'C' && docType !== 'D') err = "Invalid document type";

    /* commit the record(s). need to do this first to get taxes committed if necessary */
    else data.commitRecord('XM.Receivable', receivable);

    /* post the document */
    if(!err) {

      /* sql for debit and credit memos - not really 'creating' here, this actually posts the document. needs reduction */
      if (docType === 'D') {
        sql = "select createARDebitMemo( $1,$2::integer, NULL::integer, $3::text, $4, $5::date, $6::numeric, $7, $8, $9, $10, $11::date, $12, $13, $14::numeric, $15 ) as result";
      } else {
        sql = "select createARCreditMemo( $1,$2::integer, $3::text, $4, $5::date, $6::numeric, $7, $8, $9, $10, $11::date, $12, $13, $14::numeric, $15 ) as result";;
      }
      ret = plv8.execute(sql, [receivable.guid, receivable.customer.guid, receivable.number, receivable.orderNumber,
                             receivable.documentDate, receivable.amount, receivable.notes, receivable.reasonCode,
                             salesCategory, ledgerAccount, receivable.dueDate, receivable.terms, receivable.salesRep,
                             receivable.commissionDue, receivable.currency])[0].result;
      if (ret === 0) err = "Amount must be greater than zero.";
      else return ret;
    }
    throw new Error(err);
  }
  
$$ );
