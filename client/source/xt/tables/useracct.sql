-- table definition
select xt.create_table('useracct', 'xt');

-- remove old trigger if any
drop trigger if exists useracct_did_change on xt.useracct;

select xt.add_column('useracct', 'useracct_id', 'integer', 'unique');
select xt.add_column('useracct', 'useracct_username', 'text', 'primary key');

-- insert database users
insert into xt.useracct (useracct_username)
select usename::text
from pg_user
  join usrpref on (usrpref_username = usename)
    and (usrpref_name='active')
where not exists (
  select useracct_username
  from xt.useracct
  where usename=useracct_username
);

update xt.useracct set
  useracct_id = usesysid::integer
from pg_user
where usename = useracct_username;

-- Create the sequence if there isn't one already.
-- This isn't serial or default value because of potential ovelap
-- with postgres user oid where postgres users are involved.
do $$
 var sql = "select c.relname " +
           "from pg_class c " +
           "where c.relkind = 'S' " +
           "  and c.relname = 'useracct_useracct_id_seq';",
   res = plv8.execute(sql);

 if (!res.length) {
   sql = "create sequence xt.useracct_useracct_id_seq; " +
         "alter table xt.useracct_useracct_id_seq owner to admin;" +
         "grant all on table xt.useracct_useracct_id_seq to admin;" +
         "grant all on table xt.useracct_useracct_id_seq to xtrole;"
   plv8.execute(sql);
 }
$$ language plv8;

-- create trigger
create trigger useracct_did_change after insert on xt.useracct for each row execute procedure xt.useracct_did_change();





