select xt.install_js('XM','Customer','xtuple', $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  XM.Customer = {};
  
  XM.Customer.isDispatchable = true;

  /**
    Return the price for an item for a customer.
    
    @param {Number} customer id
    @param {Number} shipto id (optional)
    @param {Number} item id
    @param {Number} quantity
    @param {Number} quantity unit id
    @param {Number} currency id
    @param {Date} effective date
    @returns Number
  */
  XM.Customer.price = function(customerId, shiptoId, itemId, quantity, quantityUnitId, priceUnitId, currencyId, effective) {
    var shiptoId = shiptoId ? shiptoId : -1,
        sql = 'select itemPrice($1, $2, $3, $4, $5, $6, $7, $8::date) as price',
        ret = executeSql(sql,[itemId, customerId, shiptoId, quantity, quantityUnitId, priceUnitId, currencyId, effective])[0];
    return JSON.stringify(ret);
  }
  
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
      var sql = "update custinfo "
              + "set cust_creditstatus = 'W' "
              + "where (((select count(aropen_id) "
              + "from aropen "
              + "where aropen_cust_id = cust_id "
              + "and aropen_open "
              + "and aropen_doctype in ('I', 'D') "
              + "and aropen_duedate < current_date "
              + "- coalesce(cust_gracedays, "
              + "coalesce((select cast(metric_value as integer) "
              + "from metric "
              + "where (metric_name='DefaultAutoCreditWarnGraceDays')), 30))) > 0) "
              + " and (cust_autoupdatestatus) "
              + " and (cust_creditstatus = 'G')) ",
        rec = executeSql(sql);
      return rec.length ? JSON.stringify (rec) : '{}';
    }
    throw new Error(err);
  }

$$ );
