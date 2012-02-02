select private.create_model(

-- Model name, schema, table

'user_account_role_privilege_assignment', 'public', 'grppriv',

-- Columns

E'{
  "grppriv.grppriv_id as guid",
  "grppriv.grppriv_grp_id as user_account_role",
  "(select privilege
    from xm.privilege
    where guid = grppriv.grppriv_priv_id) as privilege"}',
     
-- sequence

'public.grppriv_grppriv_id_seq',

-- Rules

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.user_account_role_privilege_assignment
  do instead

insert into public.grppriv (
  grppriv_id,
  grppriv_grp_id,
  grppriv_priv_id )
values (
  new.guid,
  new.user_account_role,
  (new.privilege).guid );

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.user_account_role_privilege_assignment
  do instead nothing;

","

-- delete rules

create or replace rule \\"_DELETE\\" as on delete to xm.user_account_role_privilege_assignment
  do instead (

delete from public.grppriv
where ( grppriv_id = old.guid );

);

"}', 

-- Conditions, Comment, System

'{}', 'User Account Role Privilege Assignment Model', true, true);

