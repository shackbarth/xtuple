create or replace function xt.sordtype_did_change() returns trigger as $$
/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
   See www.xm.ple.com/CPAL for the full text of the software license. */

return (function () {

  var sql,
    rows,
    ary = [];

  rows = plv8.execute("select * from xt.sordtype");

  if (rows.length) {

    rows.forEach(function (row) {
      sql = "select " +
        row.sordtype_col_sochild_id + " as sochild_id, " +
        "''" + row.sordtype_code + "''::text" + " as sochild_type, " +
        row.sordtype_col_sochild_uuid + " as sochild_uuid, " +
        row.sordtype_col_sochild_key + " as sochild_key, " +
        row.sordtype_col_sochild_number + " as sochild_number, " +
        row.sordtype_col_sochild_status + " as sochild_status, " +
        row.sordtype_col_sochild_duedate + " as sochild_duedate, " +
        row.sordtype_col_sochild_qty + " as sochild_qty " +
        "from " + row.sordtype_nsname + "." + row.sordtype_tblname + " ";

      if (row.sordtype_joins) {
        sql = sql + row.sordtype_joins;
      }

      plv8.elog(WARNING, "sql: ", sql);
      ary.push(sql);
    });

    sql = "select xt.create_view('xt.sochild','" + ary.join(" union all ") + "', true)";
    plv8.elog(WARNING, "sql2: ", sql);
    plv8.execute(sql);

  }

  return NEW;

}());

$$ language plv8;
