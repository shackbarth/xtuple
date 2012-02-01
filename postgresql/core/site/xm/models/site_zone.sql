select private.create_model(

-- Model name, schema, table

'site_zone', 'public', 'whsezone',

-- Columns

E'{
  "whsezone.whsezone_id as guid",
  "whsezone.whsezone_warehous_id as warehous_id",
  "whsezone.whsezone_name as \\"name\\"",
  "whsezone.whsezone_descrip as description"
}',

-- sequence

'public.whsezone_whsezone_id_seq',

-- Rules

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.site_zone
  do instead

insert into whsezone (
  whsezone_id,
  whsezone_warehous_id,
  whsezone_name,
  whsezone_descrip )
values (
  new.guid,
  new.warehous_id,
  new.name,
  new.description );

","
  
-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.site_zone
  do instead
  
update whsezone set
  whsezone_name = new.name,
  whsezone_descrip = new.description
where ( whsezone_id = old.guid );

","
  
-- delete rules

create or replace rule \\"_DELETE\\" as on delete to xm.site_zone   
  do instead
  
delete from whsezone 
where ( whsezone_id = old.guid );

"}',

-- Conditions, Comment, System

'{}', 'Site Zone Model', true, true);
