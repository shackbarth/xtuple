-- table definition
select xt.create_table('useracct', 'xt');
select xt.add_column('useracct', 'useracct_id', 'integer', 'unique');
select xt.add_column('useracct', 'useracct_username', 'text', 'primary key');
select xt.add_column('useracct', 'useracct_active', 'boolean');
select xt.add_column('useracct', 'useracct_propername', 'text');
select xt.add_column('useracct', 'useracct_initials', 'text');
select xt.add_column('useracct', 'useracct_email', 'text');
select xt.add_column('useracct', 'useracct_locale_id','integer');
select xt.add_column('useracct', 'useracct_disable_export', 'boolean');


do $$
  // OID woe: I really want to check the namespace 'xt'
  var sql = "select * from pg_class c where c.relkind = 'S' and relname = 'useracct_useracct_id_seq' and relnamespace::regclass::text = '1032132';",
  qry = plv8.execute(sql);

  if (!qry.length) {
    sql = 'create sequence xt.useracct_useracct_id_seq;'
    plv8.execute(sql);
    return true;
  }
  return false;
$$ language plv8;

alter table xt.priv alter column priv_id set default nextval('xt.useracct_useracct_id_seq'::regclass);
