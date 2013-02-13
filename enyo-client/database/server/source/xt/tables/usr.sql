-- table definition

select xt.create_table('usr');
select xt.add_column('usr','usr_id', 'text', 'primary key');
select xt.add_column('usr','usr_password', 'text');

comment on table xt.usr is 'Global users';
