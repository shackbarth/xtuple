select xt.create_table('rptdef');

select xt.add_column('rptdef','rptdef_id', 'serial', 'primary key');
select xt.add_column('rptdef','rptdef_name', 'not null');
select xt.add_column('rptdef','rptdef_record_type', 'text');
select xt.add_column('rptdef','rptdef_grade', 'integer');
select xt.add_column('rptdef','rptdef_definition', 'text');

comment on table xt.rptdef is 'Report definitions';

-- add foreign key constraint to xt.form table's form_rptdef_id column.
select xt.add_constraint('form', 'form_rptdef_id_fkey', 'foreign key (form_rptdef_id) references xt.rptdef (rptdef_id)');
