select private.create_model(

-- Model name, schema, table

'user_privilege_assignment', 'public', 'usrpriv',

-- Columns

E'{
  "usrpriv.usrpriv_id as guid",
  "usrpriv.usrpriv_username as user",
  "usrpriv.usrpriv_priv_id as privilege"}',
     
-- Rules

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.user_privilege_assignment
  do instead

insert into public.usrpriv (
  usrpriv_id,
  usrpriv_username,
  usrpriv_priv_id )
values (
  new.guid,
  new.user,
  new.privilege );

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.user_privilege_assignment
  do instead nothing;

","

-- delete rules

create or replace rule \\"_DELETE\\" as on delete to xm.user_privilege_assignment
  do instead 
  
delete from public.usrpriv
where ( usrpriv_id = old.guid );

"}', 

-- Conditions, Comment, System

'{}', 'User Privilege Assignment Model', true);
