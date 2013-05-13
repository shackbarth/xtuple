-- table definition
select xt.create_table('useracct', 'xt');
select xt.add_column('useracct', 'useracct_id', 'integer', 'unique');
select xt.add_column('useracct', 'useracct_username', 'text', 'primary key');
select xt.add_column('useracct', 'useracct_password', 'text');
select xt.add_column('useracct', 'useracct_active', 'boolean');
select xt.add_column('useracct', 'useracct_propername', 'text');
select xt.add_column('useracct', 'useracct_initials', 'text');
select xt.add_column('useracct', 'useracct_email', 'text');
select xt.add_column('useracct', 'useracct_locale_id','integer');
select xt.add_column('useracct', 'useracct_disable_export', 'boolean');


do $$
  var sql = "select * from pg_class c join pg_catalog.pg_namespace n on (c.relnamespace = n.oid) where c.relkind = 'S' and c.relname = 'useracct_useracct_id_seq' and n.nspname = 'xt';",
  qry = plv8.execute(sql);

  if (!qry.length) {
    sql = 'create sequence xt.useracct_useracct_id_seq;'
    plv8.execute(sql);
    return true;
  }
  return false;
$$ language plv8;

alter table xt.useracct alter column useracct_id set default nextval('xt.useracct_useracct_id_seq'::regclass);
