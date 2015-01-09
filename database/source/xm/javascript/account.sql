select xt.install_js('XM','Account','xtuple', $$
  /* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */
  
  XM.Account = {};

  XM.Account.isDispatchable = true,
  
  XM.Account.findExisting = function(key, value, id) {
    /* look in crmacct for any records that have num */
    /* if you don't find one, return 0 meaning you didn't find anything
      if you do find a result, look to see if prospect or cust columns are populated.
      return an object where 1 property is the crmacct_id and the other is A for account, P for prospect or C for customer*/
      /* use result.crmacct_id to get the crmacct_id column.  the result of the query will be an array so get the 1st result */
      
    var res,
      retVal,
      row,
      sql = "select crmacct_number, cust_number, prospect_number " +
            "from crmacct " +
            "left join custinfo on cust_id = crmacct_cust_id " +
            "left join prospect on prospect_id = crmacct_prospect_id " +
            " where crmacct_number = $1";
        
    res = XM.Model.findExisting("XM.Account", key, value, id);
    
    /*if the result is falsey, no CRM account exists by this name, and return 0. */
    if (!res) {
      retVal = 0;
    } else {
      row = plv8.execute(sql, [res])[0];
      retVal = {};
      if (row.cust_number) {
        retVal.id = row.cust_number;
        retVal.type = "C";
      } else if (row.prospect_number) {
        retVal.id = row.prospect_number;
        retVal.type = "P";
      } else {
        retVal.id = row.crmacct_number;
        retVal.type = "A";
      }
    }
    
    return retVal;
  }

  XM.Account.used = function(id) {
    var sql = "select (crmacct_cust_id is null" +
	" and crmacct_prospect_id is null" +
	" and crmacct_emp_id is null" +
	" and crmacct_salesrep_id is null" +
	" and crmacct_taxauth_id is null" +
	" and crmacct_vend_id is null" +
	" and crmacct_usr_username is null) as result " +
	"from crmacct where crmacct_number = $1",
      res = plv8.execute(sql, [id])[0].result;
     return res ? XM.Model.used('XM.Account', id) : true;
  }

$$ );

