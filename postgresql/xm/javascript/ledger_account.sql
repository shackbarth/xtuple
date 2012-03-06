select xt.install_js('XM','LedgerAccount','xtuple', $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */
  
  XM.LedgerAccount = {};

  XM.LedgerAccount.isDispatchable = true,

  /** 
  Insert a duplicate acct record as a child of the 'parent' accnt with the
  company, profit, and/or sub fields changed.

  @param {String, String, String, Number, String} company, profit, subAccnt, accountId, description
  @returns {Number}
  */
  XM.Address.duplicate = function(company, profit, subAccount, accountId, description) {
    var data = Object.create(XT.Data),
        sql = "insert into accnt"
              + "(accnt_number, accnt_descrip,"
              + "accnt_comments, accnt_type, accnt_extref,"
              + "accnt_closedpost, accnt_forwardupdate,"
              + "accnt_subaccnttype_code, accnt_curr_id,"
              + "accnt_company, accnt_profit, accnt_sub) "
              + "select accnt_number, (accnt_descrip||' '||$1),"
              + "accnt_comments, accnt_type, accnt_extref,"
              + "accnt_closedpost, accnt_forwardupdate,"
              + "accnt_subaccnttype_code, accnt_curr_id,",
        ret, err;

    if(!data.checkPrivilege('MaintainChartOfAccounts')) err = "Access Denied.";
    else if(
            !(company || profit || subAccount) ||
            (accountId === undefined)
           )
      return -1;

    if(!err) {

      if(company.length)
        sql += company + ",";
      else
        sql += " accnt_company,";
      if(profit.length)
        sql += profit + ",";
      else
        sql += "accnt_profit,";
      if(subAccount.length)
        sql += subAccount + " ";
      else
        sql += "accnt_sub";

      sql += " from accnt"
             + " where (accnt_id = $2);";
      
      return executeSql(sql, [description, accountId]);
    }

    throw new Error(err);
  }

$$ );