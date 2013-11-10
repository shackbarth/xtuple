select xt.create_table('usrchart');

select xt.add_column('usrchart','usrchart_id', 'serial', 'primary key');
select xt.add_column('usrchart','obj_uuid', 'text', 'default xt.generate_uuid()', 'xt');
select xt.add_column('usrchart','usrchart_usr_username', 'text');
select xt.add_column('usrchart','usrchart_chart', 'text');
select xt.add_column('usrchart','usrchart_ext_name', 'text');
select xt.add_column('usrchart','usrchart_filter_option', 'text');
select xt.add_column('usrchart','usrchart_groupby_option', 'text');
select xt.add_column('usrchart','usrchart_order', 'integer');


comment on table xt.usrchart is 'Charts users have selected for dashboard';
