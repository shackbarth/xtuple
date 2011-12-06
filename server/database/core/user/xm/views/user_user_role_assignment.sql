select dropIfExists('VIEW', 'user_user_role_assignment', 'xm');

-- return rule

create or replace view xm.user_user_role_assignment as 

select
  usrgrp_id as id,
  usrgrp_username as user,
  usrgrp_grp_id as user_role
from public.usrgrp;

-- insert rule

create or replace rule "_CREATE" as on insert to xm.user_user_role_assignment
  do instead

insert into public.usrgrp (
  usrgrp_id,
  usrgrp_username,
  usrgrp_grp_id )
values (
  new.id,
  new.user,
  new.user_role );

-- update rule

create or replace rule "_UPDATE" as on update to xm.user_user_role_assignment
  do instead nothing;

-- delete rules

create or replace rule "_DELETE" as on delete to xm.user_user_role_assignment
  do instead 
  
delete from public.usrgrp
where ( usrgrp_id = old.id );
