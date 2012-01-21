select private.create_model(

-- Model name, schema, table

'comment_type', 'public', 'cmnttype',

-- Columns

E'{
  "cmnttype.cmnttype_id as guid",
  "cmnttype.cmnttype_name as name",
  "cmnttype.cmnttype_descrip as description",
  "cmnttype.cmnttype_sys as is_system",
  "cmnttype.cmnttype_editable as comments_editable",
  "cmnttype.cmnttype_order as order"}',
     
-- Rules

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.comment_type
  do instead

insert into public.cmnttype (
  cmnttype_id,
  cmnttype_name,
  cmnttype_descrip,
  cmnttype_sys,
  cmnttype_editable,
  cmnttype_order )
values (
  new.guid,
  new.name,
  new.description,
  false,
  new.comments_editable,
  new.order );

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.comment_type
  do instead

update public.cmnttype set
  cmnttype_name = new.name,
  cmnttype_descrip = new.description,
  cmnttype_editable = new.comments_editable,
  cmnttype_order = new.order
where ( cmnttype_id = old.guid )
 and ( not cmnttype_sys );

","

-- delete rules

create or replace rule \\"_DELETE\\" as on delete to xm.comment_type
  do instead 
  
delete from public.cmnttype
where ( cmnttype_id = old.guid )
 and ( not cmnttype_sys );

"}', 

-- Conditions, Comment, System

'{}', 'Comment Type Model', true);
