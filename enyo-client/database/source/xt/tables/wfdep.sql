-- table definition

select xt.create_table('wfdep');

select xt.add_column('wfdep','wfdep_id', 'serial');
select xt.add_column('wfdep','wfdep_source_id', 'integer', 'not null');
select xt.add_column('wfdep','wfdep_target_id', 'integer', 'not null');

comment on table xt.wfdep is 'Workflow dependency base table';
