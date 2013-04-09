select xt.create_table('bicache');

select xt.add_column('bicache','bicache_key', 'text', 'primary key');
select xt.add_column('bicache','bicache_query', 'text');
select xt.add_column('bicache','bicache_locale', 'text');
select xt.add_column('bicache','bicache_schema', 'text');
select xt.add_column('bicache','bicache_data', 'text');
select xt.add_column('bicache','bicache_created', 'timestamp');


comment on table xt.bicache is 'Temp query data requested from node by client to be rendered by BI';
