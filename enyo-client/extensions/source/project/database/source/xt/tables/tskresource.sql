select xt.create_table('tskresource');

select xt.add_column('tskresource','tskresource_id', 'serial', 'primary key');
select xt.add_column('tskresource','tskresource_prjtask_id', 'integer', 'references prjtask (prjtask_id)');
select xt.add_column('tskresource','tskresource_resource_id', 'text');
select xt.add_column('tskresource','tskresource_percent', 'numeric');

comment on table xt.tskresource is 'Mapping of tasks to resources';

