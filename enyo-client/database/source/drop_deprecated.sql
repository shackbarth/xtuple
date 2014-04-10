DROP TABLE IF EXISTS xt.grp CASCADE;
DROP TABLE IF EXISTS xt.grppriv CASCADE;
DROP TABLE IF EXISTS xt.usrgrp CASCADE;
DROP TABLE IF EXISTS xt.usrpref CASCADE;
DROP TABLE IF EXISTS xt.usrpriv CASCADE;
DROP TABLE IF EXISTS xt.priv CASCADE;
DROP TABLE IF EXISTS xt.useracct CASCADE;
DROP TABLE IF EXISTS xt.useracctorg CASCADE;
DROP TABLE IF EXISTS xt.userpriv CASCADE;
DROP TABLE IF EXISTS xt.userrole CASCADE;
DROP TABLE IF EXISTS xt.userrolepriv CASCADE;
DROP TABLE IF EXISTS xt.useruserrole CASCADE;
DROP TABLE IF EXISTS xt.usrorg CASCADE;
DROP TABLE IF EXISTS xt.filter CASCADE;
DROP TABLE IF EXISTS xt.remitto CASCADE;
DROP TABLE IF EXISTS xt.bicache CASCADE;
DROP VIEW IF EXISTS xt.usr CASCADE;
DROP FUNCTION IF EXISTS xt.createuser(text, boolean);
DROP FUNCTION IF EXISTS xt.user_account_sync(text);
DROP TRIGGER IF EXISTS grp_did_change on public.grp;
DROP TRIGGER IF EXISTS grppriv_did_change on public.grppriv;
DROP TRIGGER IF EXISTS usrpref_did_change on usrpref;
--DROP TRIGGER IF EXISTS useracct_did_change on xt.useracct;
--DROP TRIGGER IF EXISTS usrgrp_did_change on xt.usrgrp;
--DROP TRIGGER IF EXISTS usrpref_did_change on xt.usrpref;
--DROP TRIGGER IF EXISTS usrpriv_did_change on xt.usrpriv;

--delete from xt.pkgscript where script_name in ('user', 'users', 'userPreferences');

/* Cleans up old xt.obj uuid installs and converts them from data type text to uuid. */
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
      plv8.execute("drop schema if exists xtstd cascade;");

      /* Alter xt.obj type. */
      plv8.execute("alter table xt.obj alter column obj_uuid type uuid using obj_uuid::uuid;");

      /* Recreate saleshistory views. */
      plv8.execute("CREATE OR REPLACE VIEW saleshistory AS " + saleshistory);
      plv8.execute("CREATE OR REPLACE VIEW saleshistorymisc AS " + saleshistorymisc);
    }

    /* Resets the xt.obj.obj_uuid defualt after the cleanup. */
    /* This will also set the default on ALL child tables that inherit from xt.obj. */
    plv8.execute("ALTER TABLE xt.obj ALTER COLUMN obj_uuid SET DEFAULT xt.uuid_generate_v4();");
  }
$$ language plv8;


