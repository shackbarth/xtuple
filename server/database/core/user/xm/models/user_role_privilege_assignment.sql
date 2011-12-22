select private.create_model(

-- Model name, schema, table

'user_role_privilege_assignment', 'public', 'grppriv',

-- Columns

E'{
  "grppriv.grppriv_id as id",
  "grppriv.grppriv_grp_id as user_role",
  "grppriv.grppriv_priv_id as privilege"}',
     
-- Rules

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.user_role_privilege_assignment
  do instead

insert into public.grppriv (
  grppriv_id,
  grppriv_grp_id,
  grppriv_priv_id )
values (
  new.id,
  new.user_role,
  new.privilege );

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.user_role_privilege_assignment
  do instead nothing;

","

-- delete rules

create or replace rule \\"_DELETE\\" as on delete to xm.user_role_privilege_assignment
  do instead (

delete from public.grppriv
where ( grppriv_id = old.id );

);

"}', 

-- Conditions, Comment, System

'{}', 'User Role Privilege Assignment Model', true);

