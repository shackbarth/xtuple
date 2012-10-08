-- table definition
select xt.create_table('useracct', 'xt');
select xt.add_column('useracct', 'useracct_username', 'text', 'primary key');

-- insert database users
insert into xt.useracct
select usename 
from pg_user
where not exists (
  select useracct_username
  from xt.useracct
  where usename=useracct_username
);

