/* Cleans up old xt.obj uuid installs and converts them from data type text to uuid. */
/* Need to do this twice. Once in lib/orm/source and once in enyo-client/database/source/xt */
/* To support new installs and upgrading old ones. */
DO $$
  var obj,
    saleshistory,
    saleshistorymisc;

  obj = plv8.execute("select data_type from information_schema.columns where table_schema = 'xt' and table_name = 'obj' and column_name = 'obj_uuid';");

  if (obj.length) {
    plv8.execute("ALTER TABLE xt.obj ALTER COLUMN obj_uuid DROP DEFAULT;");

    /* Check xt.obj type. */
    if (obj[0].data_type === 'text') {
      /* Get saleshistory view defs. */
      saleshistory = plv8.execute("select pg_get_viewdef('saleshistory', true)")[0].pg_get_viewdef;
      saleshistorymisc = plv8.execute("select pg_get_viewdef('saleshistorymisc', true)")[0].pg_get_viewdef;

      /* Drop saleshistory views. */
      plv8.execute("DROP VIEW saleshistory;");
      plv8.execute("DROP VIEW saleshistorymisc;");

      /* Alter xt.obj type. */
      plv8.execute("alter table xt.obj alter column obj_uuid type uuid using obj_uuid::uuid;");

      /* Recreate saleshistory views. */
      plv8.execute("CREATE OR REPLACE VIEW saleshistory AS " + saleshistory);
      plv8.execute("CREATE OR REPLACE VIEW saleshistorymisc AS " + saleshistorymisc);
    }
  }
$$ language plv8;
