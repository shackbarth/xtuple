select xt.install_js('XM','Customer','xtuple', $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  XM.Customer = {};
  
  XM.Customer.isDispatchable = true;
  
  /** 
   Update late credit status.

   @param {}
   @returns {Number}
  */
  XM.Customer.updateLateCreditStatus = function() {
    var data, rec, err;

    data = Object.create(XT.Data);
    if(!data.checkPrivilege('UpdateCustomerCreditStatus')) err = "Access Denied.";

    if(!err) {
    var sql = "UPDATE custinfo "
            + "SET cust_creditstatus = 'W' "
            + "WHERE(((SELECT count(aropen_id) "
            + "FROM aropen "
            + "WHERE aropen_cust_id = cust_id "
            + "AND aropen_open "
            + "AND aropen_doctype IN ('I', 'D') "
            + "AND aropen_duedate < CURRENT_DATE "
            + "- COALESCE(cust_gracedays, "
            + "COALESCE((SELECT CAST(metric_value AS INTEGER) "
            + "FROM metric "
            + "WHERE(metric_name='DefaultAutoCreditWarnGraceDays')),30))) > 0) "
            + "AND (cust_autoupdatestatus) "
            + "AND (cust_creditstatus = 'G')) ",
        rec = executeSql(sql);
    
    return rec.length ? JSON.stringify (rec) : '{}';
    }

    throw new Error(err);
  }

$$ );
