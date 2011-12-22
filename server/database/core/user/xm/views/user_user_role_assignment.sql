select private.create_model(

-- Model name, schema, table

'user_user_role_assignment', 'public', 'usrgrp',

-- Columns

E'{
  "usrgrp.usrgrp_id as id",
  "usrgrp.usrgrp_username as user",
  "usrgrp.usrgrp_grp_id as user_role"}',
     
-- Rules

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.user_user_role_assignment
  do instead

insert into public.usrgrp (
  usrgrp_id,
  usrgrp_username,
  usrgrp_grp_id )
values (
  new.id,
  new.user,
  new.user_role );

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.user_user_role_assignment
  do instead nothing;

","

-- delete rules

create or replace rule \\"_DELETE\\" as on delete to xm.user_user_role_assignment
  do instead 
  
delete from public.usrgrp
where ( usrgrp_id = old.id );

"}', 

-- Conditions, Comment, System

'{}', 'User User Role Assignment Model', true);
