select xt.install_js('XM','Customer','xtuple', $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */
  
  XM.Customer = {};

  XM.Customer.isDispatchable = true,
  
  XM.Customer.findExisting = function(key, value, id) {
    /* look in crmacct for any records that have num */
    /* if you don't find one, return 0 meaning you didn't find anything
      if you do find a result, look to see if prospect or cust columns are populated.
      return an object where 1 property is the crmacct_id and the other is A for account, P for prospect or C for customer*/
      /* use result.crmacct_id to get the crmacct_id column.  the result of the query will be an array so get the 1st result */
      
      
    var res,
        retVal,
        row,
        sql = "select * from crmacct where crmacct_id = $1";
        
    res = XM.Model.findExisting("XM.Account", key, value, id);
    
    /*if the result is falsey, no CRM account exists by this name, and return 0. */
    if (!res) {
      retVal = 0;
    } else {
      row = plv8.execute(sql, [res])[0];
      retVal = {};
      if (row.crmacct_cust_id) {
        retVal.id = row.crmacct_cust_id;
        retVal.type = "C";
      } else if (row.crmacct_prospect_id) {
        retVal.id = row.crmacct_prospect_id;
        retVal.type = "P";
      } else {
        retVal.id = row.crmacct_id;
        retVal.type = "A";
      }
    }
    
    return JSON.stringify(retVal);
  }

$$ );