select xt.create_table('cmpg');
select xt.add_column('cmpg','cmpg_id', 'serial', 'primary key');
select xt.add_column('cmpg','cmpg_number', 'text');
select xt.add_column('cmpg','cmpg_effective', 'date');
select xt.add_column('cmpg','cmpg_expires', 'date');
select xt.add_column('cmpg','cmpg_descrip', 'text');
select xt.add_column('cmpg','cmpg_note', 'text');

comment on table xt.org is 'Campaigns. An attribute of organizations.';

