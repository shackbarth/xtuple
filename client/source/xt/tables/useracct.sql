-- table definition

-- remove old trigger if any
drop trigger if exists useracct_did_change on xt.useracct;

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

update xt.useracct set
  useracct_active = case when usrpref_value='t' then true else false end 
from usrpref 
where usrpref_username=useracct_username
 and usrpref_name='active';

update xt.useracct set
  useracct_propername = coalesce(usrpref_value, '')
from usrpref 
where usrpref_username=useracct_username
 and usrpref_name='propername';

update xt.useracct set
  useracct_initials = coalesce(usrpref_value, '')
from usrpref 
where usrpref_username=useracct_username
 and usrpref_name='initials';
 
update xt.useracct set
  useracct_email = coalesce(usrpref_value, '')
from usrpref 
where usrpref_username=useracct_username and
  usrpref_name='email';

update xt.useracct set
  useracct_locale_id = coalesce((
    select usrpref_value::integer
    from usrpref 
    where usrpref_username=useracct_username 
     and usrpref_name='locale_id'), (
    select locale_id 
    from locale 
    where lower(locale_code) = 'default' limit 1), (
    select locale_id 
    from locale 
    order by locale_id limit 1))
where useracct_locale_id is null;

update xt.useracct set
  useracct_disable_export = coalesce(usrpref_value = 't', false)
from usrpref
where usrpref_name='DisableExportContents'
 and usrpref_username=useracct_username;

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
create trigger useracct_did_change after insert or update on xt.useracct for each row execute procedure xt.useracct_did_change();





