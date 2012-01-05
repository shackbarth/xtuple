select private.create_model(

-- Model name, schema, table

'site_type', 'public', 'sitetype',

-- Columns

E'{
  "sitetype.sitetype_id as guid",
  "sitetype.sitetype_name as \\"name\\"",
  "sitetype.sitetype_descrip as description"
}',

-- Rules

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.site_type
  do instead

insert into sitetype (
  sitetype_id,
  sitetype_name,
  sitetype_descrip )
values (
  new.guid,
  new.name,
  new.description );

","
  
-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.site_type
  do instead
  
update sitetype set 
  sitetype_name = new.name,
  sitetype_descrip = new.description
where ( sitetype_id = old.guid );

","
  
-- delete rules

create or replace rule \\"_DELETE\\" as on delete to xm.site_type   
  do instead
  
delete from sitetype 
where ( sitetype_id = old.guid );

"}',

-- Conditions, Comment, System

'{}', 'Site Type Model', true);
