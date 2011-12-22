select private.create_model(

-- Model name, schema, table

'user_role', 'public', 'grp',

-- Columns

E'{
  "grp_id as id",
  "grp_name as name",
  "grp_descrip as description",
  "btrim(array(
    select grppriv_priv_id
    from grppriv
    where grppriv_grp_id = grp_id )::text,\'{}\') as privileges",
  "btrim(array(
    select usrgrp_username
    from usrgrp
    where usrgrp_grp_id = grp_id )::text,\'{}\') as users"}',
     
-- Rules

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.user_role
  do instead

insert into grp (
  grp_id,
  grp_name,
  grp_descrip )
values (
  new.id,
  new.name,
  new.description );

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.user_role
  do instead

update grp set
  grp_name = new.name,
  grp_descrip = new.description
where ( grp_id = old.id );

","

-- delete rules

create or replace rule \\"_DELETE\\" as on delete to xm.user_role
  do instead (

delete from usrgrp
where ( usrgrp_grp_id = old.id);

delete from grp
where ( grp_id = old.id );

);

"}', 

-- Conditions, Comment, System

'{}', 'User Role Model', true);
