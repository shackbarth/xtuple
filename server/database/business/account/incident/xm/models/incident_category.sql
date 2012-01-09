select private.create_model(

-- Model name, schema, table

'incident_category', 'public', 'incdtcat',

-- Columns

E'{
  "incdtcat.incdtcat_id as guid",
  "incdtcat.incdtcat_descrip as description",
  "incdtcat.incdtcat_name as name",
  "incdtcat.incdtcat_order as order"
  }',

-- Rules

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.incident_category 
  do instead

insert into incdtcat (
  incdtcat_id,
  incdtcat_descrip,
  incdtcat_name,
  incdtcat_order )
values (
  new.guid,
  new.description,
  new.name,
  new.order );

","
  
-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.incident_category
  do instead
  
update incdtcat set
  incdtcat_descrip = new.description,
  incdtcat_name = new.name,
  incdtcat_order = new.order 
where ( incdtcat_id = old.guid );

","
  
-- delete rules

create or replace rule \\"_DELETE\\" as on delete to xm.incident_category   
  do instead
  
delete from incdtcat 
where ( incdtcat_id = old.guid );

"}',

-- Conditions, Comment, System

'{}', 'Incident Category Model', true);
