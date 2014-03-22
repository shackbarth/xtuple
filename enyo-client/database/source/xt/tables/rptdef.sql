select xt.create_table('rptdef');

select xt.add_column('rptdef','rptdef_id', 'serial', 'primary key');
select xt.add_column('rptdef','rptdef_record_type', 'text');
select xt.add_column('rptdef','rptdef_grade', 'integer');
select xt.add_column('rptdef','rptdef_definition', 'text');

comment on table xt.rptdef is 'Report definitions';
