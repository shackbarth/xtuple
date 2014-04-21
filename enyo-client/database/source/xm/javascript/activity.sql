select xt.install_js('XM','Activity','xtuple', $$
/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
   See www.xtuple.com/CPAL for the full text of the software license. */

  XM.Activity = {};

  XM.Activity.isDispatchable = true;

  XM.Activity.reassignUser = function (activityId, username) {
    var act, i, sql, sql2, actType, query, hasPriv,
      data = Object.create(XT.Data);

    sql = "select acttype_nsname as nsname, " + 
          "  acttype_tblname as tblname, " + 
          "  acttype_col_assigned_username as colname, " + 
          "  acttype_code as code " + 
          "from xt.acttype join xt.act on act_type = acttype_code " + 
          "where act_uuid = $1; ";

    /* Make into an array if an array not passed */
    if (typeof arguments[0] !== "object") {
      ary = [{activityId: activityId, username: username}];
    } else {
      ary = arguments;
    }

    for (i = 0; i < ary.length; i++) {
      act = ary[i];
      actType = plv8.execute(sql, [act.activityId])[0];

      /* TODO - may need more error handling */
      if (!actType || !actType.nsname || !actType.tblname || !actType.colname) {
        throw new handleError("activity type not found in xt.acttype", 400);
      } 

      /* Check privileges for each activity type */
      switch (actType.code)
      {
      case "Incident":
        hasPriv = data.checkPrivilege("MaintainAllIncidents");
        break;
      case "Opportunity":
        hasPriv = data.checkPrivilege("MaintainAllOpportunities");
        break;
      case "Project":
        hasPriv = data.checkPrivilege("MaintainAllProjects");
        break;
      case "ProjectTask":
        hasPriv = data.checkPrivilege("MaintainAllProjects");
        break;
      case "ProjectWorkflow":
        hasPriv = data.checkPrivilege("MaintainAllWorkflows");
        break;
      case "PurchaseOrder":
        hasPriv = data.checkPrivilege("MaintainPurchaseOrders");
        break;
      case "PurchaseOrderWorkflow":
        hasPriv = data.checkPrivilege("MaintainAllWorkflows");
        break;
      case "SalesOrder":
        hasPriv = data.checkPrivilege("MaintainSalesOrders");
        break;
      case "SalesOrderWorkflow":
        hasPriv = data.checkPrivilege("MaintainAllWorkflows");
        break;
      case "ToDo":
        hasPriv = data.checkPrivilege("ReassignToDoItems");
        break;
      case "TransferOrder":
        hasPriv = data.checkPrivilege("MaintainTransferOrders");
        break;
      case "TransferOrderWorkflow":
        hasPriv = data.checkPrivilege("MaintainAllWorkflows");
        break;
      case "WorkOrder":
        hasPriv = data.checkPrivilege("MaintainWorkOrders");
        break;
      case "WorkOrderWorkflow":
        hasPriv = data.checkPrivilege("MaintainAllWorkflows");
        break;
      }

      /* check privileges */
      if(!hasPriv) throw new Error('Access Denied');
      
      /**
        Activities can be incidents, orders, workflows, etc. 
        So we need to dynamically build this query. 
        sql2 ex. "update xt.wowf set wf_assigned_username = 'postgres' 
        where xt.wowf.obj_uuid = '7551c4e4-ea5e-4192-8dbf-7305448f5a3e'"; 
      */
      query = "update %1$I.%2$I set %3$I = $1 where obj_uuid = $2; ";

      sql2 = XT.format(query, [actType.nsname, actType.tblname, actType.colname]);

      plv8.execute(sql2, [act.username, act.activityId])[0];
    }
    return; 
  };
  
$$ );
