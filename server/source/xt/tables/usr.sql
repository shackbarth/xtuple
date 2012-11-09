-- table definition

select xt.create_table('usr');
select xt.add_column('usr','usr_id', 'serial', 'primary key');
select xt.add_column('usr','usr_username', 'text', 'unique');
select xt.add_column('usr','usr_password', 'text', 'not null');

comment on table xt.usr is 'Global users';
