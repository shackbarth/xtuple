create or replace function xt.acttype_did_change() returns trigger as $$
/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
   See www.xm.ple.com/CPAL for the full text of the software license. */

return (function () {

 var sql,
   rows,
   ary = [];

 rows = plv8.execute("select * from xt.acttype");

 if (rows.length) {
   rows.forEach(function (row) {
     sql = "select " +
       row.acttype_col_uuid + " as act_uuid," +
       row.acttype_col_editor_key + " as act_editor_key, " +
       row.acttype_col_type + " as act_type, " +
       row.acttype_col_name + " as act_name, " +
       row.acttype_col_active + " as act_active, " +
       row.acttype_col_status + " as act_status, " +
       row.acttype_col_priority_id + " as act_priority_id, " +
       row.acttype_col_description + " as act_description, " +
       row.acttype_col_owner_username + " as act_owner_username, " +
       row.acttype_col_assigned_username + " act_assigned_username, " +
       row.acttype_col_start_date + " as act_start_date, " +
       row.acttype_col_due_date + " as act_due_date, " +
       row.acttype_col_assigned_date + " as act_assigned_date, " +
       row.acttype_col_completed_date + " as act_completed_date, " +
       row.acttype_col_parent_uuid + " as act_parent_uuid, " +
       (row.acttype_col_action || 'null') + " as act_action " +
       "from " + row.acttype_nsname + "." + row.acttype_tblname;
     if (row.acttype_join) {
       sql = sql + " " + row.acttype_join;
     }
     sql = sql + " join pg_class c on " + row.acttype_tblname + ".tableoid = c.oid ";
     sql = sql + " join xt.acttype on acttype_tblname=relname ";
     sql = sql.replace(/'/g, "''");
     ary.push(sql);

   });

   sql = "select xt.create_view('xt.act','" + ary.join(" union all ") + "', true)";
   plv8.execute(sql);
   
 }
 
 return NEW;

}());

$$ language plv8;
