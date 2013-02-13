DO $$

  plv8.execute("select xt.js_init()");
  
  var sql = "delete from xt.orm "
            + "where orm_json ~ $1;",
     deleteCondition = '"isSystem":true';
  return plv8.execute(sql, [deleteCondition]);

$$ language plv8;
