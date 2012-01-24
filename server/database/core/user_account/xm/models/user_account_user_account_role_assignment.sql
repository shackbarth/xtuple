select private.create_model(

-- Model name, schema, table

'user_account_user_account_role_assignment', 'public', 'usrgrp',

-- Columns

E'{
  "usrgrp.usrgrp_id as guid",
  "usrgrp.usrgrp_username as user_account",
  "(select user_account_role
    from xm.user_account_role
    where guid = usrgrp.usrgrp_grp_id) as user_account_role"}',
     
-- Rules

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.user_account_user_account_role_assignment
  do instead

insert into public.usrgrp (
  usrgrp_id,
  usrgrp_username,
  usrgrp_grp_id )
values (
  new.guid,
  new.user_account,
  (new.user_account_role).guid );

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.user_account_user_account_role_assignment
  do instead nothing;

","

-- delete rules

create or replace rule \\"_DELETE\\" as on delete to xm.user_account_user_account_role_assignment
  do instead 
  
delete from public.usrgrp
where ( usrgrp_id = old.guid );

"}', 

-- Conditions, Comment, System

'{}', 'User User Role Assignment Model', true, true);
