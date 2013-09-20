-- table definition

select xt.create_table('extdep');
select xt.add_column('extdep','extdep_id', 'serial', 'primary key');
select xt.add_column('extdep','extdep_from_ext_id', 'integer', 'references xt.ext (ext_id)');
select xt.add_column('extdep','extdep_to_ext_id', 'integer', 'references xt.ext (ext_id)');

comment on table xt.extdep is 'Extension dependencies';
