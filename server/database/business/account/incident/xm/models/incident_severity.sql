select private.create_model(

-- Model name, schema, table

'incident_severity', 'public', 'incdtseverity',

-- Columns

E'{
  "incdtseverity.incdtseverity_id as guid",
  "incdtseverity.incdtseverity_name as name",
  "incdtseverity.incdtseverity_order as order",
  "incdtseverity.incdtseverity_descrip as description"
}',

-- Rules

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.incident_severity 
  do instead

insert into incdtseverity (
  incdtseverity_id,
  incdtseverity_name,
  incdtseverity_order,
  incdtseverity_descrip )
values (
  new.guid,
  new.name,
  new.order,
  new.description );

","
  
-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.incident_severity
  do instead
  
update incdtseverity set
  incdtseverity_id = new.guid,
  incdtseverity_name = new.name,
  incdtseverity_order = new.order,
  incdtseverity_descrip = new.description
where ( incdtseverity_id = old.guid );

","
  
-- delete rules

create or replace rule \\"_DELETE\\" as on delete to xm.incident_severity   
  do instead
  
delete from incdtseverity 
where ( incdtseverity_id = old.guid );

"}',

-- Conditions, Comment, System

'{}', 'Incident Severity Model', true);
