-- table definition

select xt.create_table('sessionstore');
select xt.add_column('sessionstore','sessionstore_id', 'text', 'primary key');
select xt.add_column('sessionstore','sessionstore_session', 'text');

comment on table xt.sessionstore is 'These ARE NOT VALID SESSIONS, see xt.ession for that. node-datasource Express Session Store. By default, this is stored in memory, we persist it to db here.';
