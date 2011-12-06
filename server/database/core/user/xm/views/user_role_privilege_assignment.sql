select dropIfExists('VIEW', 'user_role_privilege_assignment', 'xm');

-- return rule

create or replace view xm.user_role_privilege_assignment as 

select
  grppriv_id as id,
  grppriv_grp_id as user_role,
  grppriv_priv_id as privilege
from public.grppriv;

-- insert rule

create or replace rule "_CREATE" as on insert to xm.user_role_privilege_assignment
  do instead

insert into public.grppriv (
  grppriv_id,
  grppriv_grp_id,
  grppriv_priv_id )
values (
  new.id,
  new.user_role,
  new.privilege );

-- update rule

create or replace rule "_UPDATE" as on update to xm.user_role_privilege_assignment
  do instead nothing;

-- delete rules

create or replace rule "_DELETE" as on delete to xm.user_role_privilege_assignment
  do instead (

delete from public.grppriv
where ( grppriv_id = old.id );

);
