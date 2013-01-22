select xt.install_js('XM','Account','xtuple', $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */
  
  XM.Account = {};

  XM.Account.isDispatchable = true,

  XM.Account.used = function(id) {
    var sql = "select (crmacct_cust_id is null" +
	" and crmacct_prospect_id is null" +
	" and crmacct_emp_id is null" +
	" and crmacct_salesrep_id is null" +
	" and crmacct_taxauth_id is null" +
	" and crmacct_vend_id is null" +
	" and crmacct_usr_username is null) as result " +
	"from crmacct where crmacct_id = $1",
      res = plv8.execute(sql, [id])[0].result;
     return res ? XM.Model.used('XM.Account', id) : true;
  }

$$ );

