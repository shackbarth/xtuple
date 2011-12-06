select dropIfExists('VIEW', 'user_privilege_assignment', 'xm');

-- return rule

create or replace view xm.user_privilege_assignment as 

select
  usrpriv_id as id,
  usrpriv_username as user,
  usrpriv_priv_id as privilege
from public.usrpriv;

-- insert rule

create or replace rule "_CREATE" as on insert to xm.user_privilege_assignment
  do instead

insert into public.usrpriv (
  usrpriv_id,
  usrpriv_username,
  usrpriv_priv_id )
values (
  new.id,
  new.user,
  new.privilege );

-- update rule

create or replace rule "_UPDATE" as on update to xm.user_privilege_assignment
  do instead nothing;

-- delete rules

create or replace rule "_DELETE" as on delete to xm.user_privilege_assignment
  do instead 
  
delete from public.usrpriv
where ( usrpriv_id = old.id );
