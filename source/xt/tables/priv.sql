-- table definition

select xt.create_table('priv');
select xt.add_column('priv','priv_id', 'integer', 'primary key');
select xt.add_column('priv','priv_name', 'text', 'unique');
select xt.add_column('priv','priv_descrip', 'text');
select xt.add_column('priv','priv_label', 'text');
select xt.add_column('priv','priv_group', 'text');
select xt.add_column('priv','priv_context', 'text');
select xt.add_column('priv','priv_module', 'text');
select xt.add_constraint('priv','priv_name_idx', 'unique(priv_name)');

do $$
  // OID woe: I really want to check the namespace 'xt'
  var sql = "select * from pg_class c where c.relkind = 'S' and relname = 'priv_priv_id_seq' and relnamespace::regclass::text = '1032132';",
  qry = plv8.execute(sql);

  if (!qry.length) {
    sql = 'create sequence xt.priv_priv_id_seq;'
    plv8.execute(sql);
    return true;
  }
  return false;
$$ language plv8;

alter table xt.priv alter column priv_id set default nextval('xt.priv_priv_id_seq'::regclass);

comment on table xt.priv is 'Core table for privileges';
