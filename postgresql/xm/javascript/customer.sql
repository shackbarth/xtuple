select xt.install_js('XM','Customer','xtuple', $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  XM.Customer = {};
  
  XM.Customer.isDispatchable = true;

  /**
    An array of privilege strings. Users that have access to any of these may run the outstandingCredit function.

    @seealso outStandingCredit
  */
  XM.Customer.outstandingCreditPrivileges = [
    'ViewMiscInvoices',
    'MaintainMiscInvoices'
  ];
  
  /**
    Return the price for an item for a customer.
    
    @param {Number} customer id
    @param {Number} currency id
    @param {String} date
    @returns Number
  */
  XM.Customer.outstandingCredit = function(customerId, currencyId, effective) {
    var privileges = XM.Customer.outstandingCreditPrivileges, 
        data = Object.create(XT.Data),
        isGranted = true, i = 0, sql;

    /* determine if we have privileges to do this */
    while (i < privileges.length && !isGranted) {
      isGranted = data.checkPrivilege(privileges[i]);
      i++;
    }
    if (!isGranted) throw new Error('Access Denied');

    /* query the result */
    sql = "select coalesce(sum(amount),0) as amount "
        + "from (select aropen_id, "
	+ "        currToCurr(aropen_curr_id, $2,"
        + "                   noNeg(aropen_amount - aropen_paid - sum(coalesce(aropenalloc_amount,0))), "
	+ "                   $3::date) as amount "
        + "      from aropen "
        + "        left join aropenalloc on (aropenalloc_aropen_id=aropen_id) "
        + "      where ((aropen_cust_id=$1) "
        + "        and  (aropen_doctype in ('C', 'R')) "
        + "        and  (aropen_open)) "
        + "      group by aropen_id, aropen_amount, aropen_paid, aropen_curr_id) as data;";
    return executeSql(sql,[customerId, currencyId, effective])[0].amount;
  }

  /**
    Return the price for an item for a customer.
    
    @param {Number} customer id
    @param {Number} shipto id (optional)
    @param {Number} item id
    @param {Number} quantity
    @param {Number} quantity unit id
    @param {Number} currency id
    @param {String} effective date
    @returns Number
  */
  XM.Customer.price = function(customerId, shiptoId, itemId, quantity, quantityUnitId, priceUnitId, currencyId, effective) {
    var shiptoId = shiptoId ? shiptoId : -1,
        sql = 'select itemPrice($1, $2, $3, $4, $5, $6, $7, $8::date) as price',
        ret = executeSql(sql,[itemId, customerId, shiptoId, quantity, quantityUnitId, priceUnitId, currencyId, effective])[0].price;
    return ret;
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
