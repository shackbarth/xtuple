select xt.install_js('XM','Activity','xtuple', $$
/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
   See www.xtuple.com/CPAL for the full text of the software license. */

  XM.Activity = {};

  XM.Activity.isDispatchable = true;

  XM.Activity.reassignUser = function (activityId, username) {
    var act, 
      i, 
      sql,
      sql2,
      actType;

    sql = "select acttype_nsname as nsname, " + 
          " acttype_tblname as tblname, " + 
          "acttype_col_assigned_username as colname " + 
          "from xt.acttype " + 
          "join xt.act on act_type = acttype_code " + 
          "where act_uuid = $1; ";

    /* Make into an array if an array not passed */
    if (typeof arguments[0] !== "object") {
      ary = [{activityId: activityId, username: username}];
    } else {
      ary = arguments;
    }

    /** TODO - check for privilege after privilege created for activity
    if (!XT.Data.checkPrivilege("EnterReceipts")) { throw new handleError("Access Denied", 401); }
    */

    for (i = 0; i < ary.length; i++) {
      act = ary[i];
      actType = plv8.execute(sql, [act.activityId])[0];

      /* TODO - may need more error handling */
      if (!actType || !actType.nsname || !actType.tblname || !actType.colname) {
        throw new handleError("activity type not found in xt.acttype", 400);
      } 
      
      /**
        Activities can be incidents, orders, workflows, etc. 
        So we need to dynamically build this query. 
        sql2 ex. "update xt.wowf set wf_assigned_username = 'postgres' 
        where xt.wowf.obj_uuid = '7551c4e4-ea5e-4192-8dbf-7305448f5a3e'"; 
      */
      sql2 = "update " + actType.nsname + "." + actType.tblname + 
             " set " + actType.colname + " = $1 " + 
             "where obj_uuid = $2; ";

      plv8.execute(sql2, [act.username, act.activityId])[0];
    }
    return; 
  };
  
$$ );
