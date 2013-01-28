select xt.create_table('pentahotempqrydata');

select xt.add_column('pentahotempqrydata','pentahotempqrydata_key', 'text', 'primary key');
select xt.add_column('pentahotempqrydata','pentahotempqrydata_query', 'text');
select xt.add_column('pentahotempqrydata','pentahotempqrydata_data', 'text');
select xt.add_column('pentahotempqrydata','pentahotempqrydata_created', 'timestamp');


comment on table xt.pentahotempqrydata is 'Temp query data requested from node by client to be rendered by Pentaho';