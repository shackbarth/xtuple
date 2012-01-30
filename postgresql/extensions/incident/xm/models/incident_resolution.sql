select private.create_model(

-- Model name, schema, table

'incident_resolution', 'public', 'incdtresolution',

-- Columns

E'{
  "incdtresolution.incdtresolution_id as guid",
  "incdtresolution.incdtresolution_name as name",
  "incdtresolution.incdtresolution_order as order",
  "incdtresolution.incdtresolution_descrip as description"
}',

-- Rules

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.incident_resolution 
  do instead

insert into incdtresolution (
  incdtresolution_id,
  incdtresolution_name,
  incdtresolution_order,
  incdtresolution_descrip )
values (
  new.guid,
  new.name,
  new.order,
  new.description );

","
  
-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.incident_resolution
  do instead
  
update incdtresolution set
  incdtresolution_id = new.guid,
  incdtresolution_name = new.name,
  incdtresolution_order = new.order,
  incdtresolution_descrip = new.description
where ( incdtresolution_id = old.guid );

","
  
-- delete rules

create or replace rule \\"_DELETE\\" as on delete to xm.incident_resolution   
  do instead
  
delete from incdtresolution 
where ( incdtresolution_id = old.guid );

"}',

-- Conditions, Comment, System

'{}', 'Incident Resolution Model', true);
