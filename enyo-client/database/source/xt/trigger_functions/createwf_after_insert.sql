create or replace function xt.createwf_after_insert() returns trigger as $$
/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
   See www.xm.ple.com/CPAL for the full text of the software license. */

return (function () {

  if (typeof XT === 'undefined') { 
    plv8.execute("select xt.js_init();"); 
  }

  if (TG_OP === 'INSERT') {
    if (plv8.execute("select fetchmetricbool('TriggerWorkflow') as val;")[0].val) {
      var parentId,
        parentIdSql,
        sourceModSql = "select wftype_src_tblname as srctblname from xt.wftype where wftype_code = $1 ",
        sourceModel;
      
      if (TG_TABLE_NAME === 'cohead') {
        sourceModel = plv8.execute(sourceModSql, ['SO'])[0].srctblname;
        
        if (!sourceModel) {
          plv8.elog(WARNING, "Missing sourceModel and/or parentId needed to generate workflow!");
        }
        plv8.execute("SELECT xt.workflow_inheritsource($1, $2, $3, $4)",
          ["xt." + sourceModel, 'XM.SalesOrderWorkflow', NEW.obj_uuid, NEW.cohead_saletype_id]);
      }

      if (TG_TABLE_NAME === 'prj') {
        sourceModel = plv8.execute(sourceModSql, ['PRJ'])[0].srctblname;

        if (!sourceModel) {
          plv8.elog(WARNING, "Missing sourceModel and/or parentId needed to generate workflow!");
        }
        plv8.execute("SELECT xt.workflow_inheritsource($1, $2, $3, $4)",
          ["xt." + sourceModel, 'XM.ProjectWorkflow', NEW.obj_uuid, NEW.prj_prjtype_id]);
      }

      /*
        This is not going to work at this time because xt.poheadext gets populated *after* this trigger runs on the
        the pohead table. Potype needs to be built into Qt client or potypewf changed to use vendor type as the 
        source for the "default" workflow functionality.

      if (TG_TABLE_NAME === 'pohead') {
        sourceModel = plv8.execute(sourceModSql, ['PO'])[0].srctblname;
        parentIdSql = "select poheadext_id as parent_id from xt.poheadext order by poheadext_id desc limit 1 ";
        parentId = plv8.execute(parentIdSql)[0].parent_id;

        if (!sourceModel || !parentId) {
          plv8.elog(WARNING, "Missing sourceModel and/or parentId needed to generate workflow!");
        }
        plv8.execute("SELECT xt.workflow_inheritsource($1, $2, $3, $4)",
          ["xt." + sourceModel, 'XM.PurchaseOrderWorkflow', NEW.obj_uuid, parentId]);
      }
      */

      if (TG_TABLE_NAME === 'tohead') {
        sourceModel = plv8.execute(sourceModSql, ['TO'])[0].srctblname;
        parentIdSql = "select warehous_sitetype_id as parent_id from warehous where warehous_id = $1";
        parentId = plv8.execute(parentIdSql, [NEW.tohead_src_warehous_id])[0].parent_id;

        if (!sourceModel || !parentId) {
          plv8.elog(WARNING, "Missing sourceModel and/or parentId needed to generate workflow!");
        }
        plv8.execute("SELECT xt.workflow_inheritsource($1, $2, $3, $4);",
          ["xt." + sourceModel, 'XM.TransferOrderWorkflow', NEW.obj_uuid, parentId]);
      }

      if (TG_TABLE_NAME === 'wo') {
        sourceModel = plv8.execute(sourceModSql, ['WO'])[0].srctblname;
        parentIdSql = "select itemsite_plancode_id as parent_id from itemsite where itemsite_id = $1";
        parentId = plv8.execute(parentIdSql, [NEW.wo_itemsite_id])[0].parent_id;

        if (!sourceModel || !parentId) {
          plv8.elog(WARNING, "Missing sourceModel and/or parentId needed to generate workflow!");
        }
        plv8.execute("SELECT xt.workflow_inheritsource($1, $2, $3, $4);", ["xt." + sourceModel, 'XM.WorkOrderWorkflow', NEW.obj_uuid, parentId]);
      }

      return NEW;
    }
  }

}());

$$ language plv8;