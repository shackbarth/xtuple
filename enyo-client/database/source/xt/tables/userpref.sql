select xt.create_table('userpref');

select xt.add_column('userpref','userpref_id', 'serial', 'primary key');
select xt.add_column('userpref','userpref_usr_username', 'text');
select xt.add_column('userpref','userpref_name', 'text');
select xt.add_column('userpref','userpref_value', 'text');

comment on table xt.userpref is 'User preference data';

