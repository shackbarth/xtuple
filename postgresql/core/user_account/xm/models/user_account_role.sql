select private.create_model(

-- Model name, schema, table

'user_account_role', 'public', 'grp',

-- Columns

E'{
  "grp.grp_id as guid",
  "grp.grp_name as name",
  "grp.grp_descrip as description",
  "array(
    select user_account_role_privilege_assignment
    from xm.user_account_role_privilege_assignment
    where guid = grp.grp_id) as privileges"}',
     
-- sequence

'public.grp_grp_id_seq',

-- Rules

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.user_account_role
  do instead

insert into grp (
  grp_id,
  grp_name,
  grp_descrip )
values (
  new.guid,
  new.name,
  new.description );

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.user_account_role
  do instead

update grp set
  grp_name = new.name,
  grp_descrip = new.description
where ( grp_id = old.guid );

","

-- delete rules

create or replace rule \\"_DELETE\\" as on delete to xm.user_account_role
  do instead (

delete from usrgrp
where ( usrgrp_grp_id = old.guid);

delete from grp
where ( grp_id = old.guid );

);

"}', 

-- Conditions, Comment, System

'{}', 'User Account Role Model', true, true);
