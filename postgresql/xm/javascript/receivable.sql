select xt.install_js('XM','Receivable','xtuple', $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */
  
  XM.Receivable = {};

  XM.Receivable.isDispatchable = true;

  /**
    @constant
    @static
    @default 0
  */
  XM.Receivable.NO_FILTER = 0;

  /**
    @constant
    @static
    @default 1
  */
  XM.Receivable.CUSTOMER_FILTER = 1;

  /**
    @constant
    @static
    @default 2
  */
  XM.Receivable.CUSTOMER_TYPE_FILTER = 2;

  /**
    @constant
    @static
    @default 3
  */
  XM.Receivable.CUSTOMER_TYPE_PATTERN_FILTER = 3;

  /**
    @constant
    @static
    @default 4
  */
  XM.Receivable.CUSTOMER_GROUP_FILTER = 4;
  
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
      ret = plv8.execute(sql, [receivable.id, receivable.customer.id, receivable.number, receivable.orderNumber,
                             receivable.documentDate, receivable.amount, receivable.notes, receivable.reasonCode,
                             salesCategory, ledgerAccount, receivable.dueDate, receivable.terms, receivable.salesRep,
                             receivable.commissionDue, receivable.currency])[0].result;
      if (ret === 0) err = "Amount must be greater than zero.";
      else return ret;
    }
    throw new Error(err);
  };

  /**
    Returns array of receivable aging records.
    
    @param {String} as of date
    @param {Boolean} use document date
    @param {Number} filter type
    @param {Object} filter value
    @returns {Array}
  */
  XM.Receivable.aging = function(asOf, useDocDate, filterType, filterValue) {
    var K = XM.Receivable;
    var clause;
    var ret;
    var sql = 'select xm.customer_info, ' +
              'sum(araging_total_val) AS "total", ' +
              'sum(araging_cur_val) AS "current",' +
              'sum(araging_thirty_val) AS "thirtyDays", ' +
              'sum(araging_sixty_val) AS "sixtyDays", ' +
              'sum(araging_ninety_val) AS "ninetyDays", ' +
              'sum(araging_plus_val) AS "overNinetyDays", ' +
              'from araging($1::date, $2) ' +
              ' join xm.customer_info on id=cust_id '
              'where {clause} ' + 
              'group by araging_cust_number, araging_cust_id, araging_cust_name ' +
              'order by araging_cust_number ';

    /* set the filter clause */
    switch(filterType) {
      case K.CUSTOMER_FILTER:
        clause = "cust=" + filterValue;
        break;
      case K.CUSTOMER_TYPE_FILTER:
        clause = "cust_type=" + filterValue;
        break;
      case K.CUSTOMER_TYPE_PATTERN_FILTER:
        clause = "cust_type_pattern ~ '" + filterValue + "'"; 
        break;
      case K.CUSTOMER_GROUP_FILTER:
        clasue = "cust_id in (" + 
                 "select custgrp_cust_id " +
                 "from custgrpitem " +
                 "where custgrpitem_custgrp_id=" + filterValue + ")";
        break;
      default:
        clause = "true";
    };

    sql = sql.replace(/{clause}/, clause);

    /* execute */
    ret = executeSql(sql, [asOf, useDocDate]);
    return JSON.stringify(ret);
  };
  
$$ );
