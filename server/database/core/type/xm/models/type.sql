select private.create_model(

-- Model name, schema, table

'type', 'private', 'datatype',

-- Columns

E'{
  "datatype.datatype_id as guid",
  "datatype.datatype_name as name",
  "datatype.datatype_descrip as description"
}',

-- Rules

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.type
  do instead

insert into private.datatype (
  datatype_id,
  datatype_name,
  datatype_descrip )
values (
  new.guid,
  new.name,
  new.description );

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.type
  do instead

update private.datatype set
  datatype_name = new.name
where ( datatype_id = old.guid );

","

-- delete rules

create or replace rule \\"_DELETE\\" as on delete to xm.type
  do instead 
  
delete from private.datatype
where ( datatype_id = old.guid );

"}',

-- Condtions, Comment, System

'{}', 'Type Model', true);
