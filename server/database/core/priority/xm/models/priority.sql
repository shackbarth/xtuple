select private.create_model(

-- Model name, schema, table

'incident', 'public', 'incdtpriority',

-- Columns

E'{
  "incdtpriority_id as guid",
  "incdtpriority_name as name",
  "incdtpriority_order as order",
  "incdtpriority_descrip as description"}',

-- Rules

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.priority
  do instead

insert into incdtpriority (
  incdtpriority_id,
  incdtpriority_name,
  incdtpriority_order,
  incdtpriority_descrip )
values (
  new.guid,
  new.name,
  new.order,
  new.description );

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.priority
  do instead
  
update incdtpriority set
  incdtpriority_name = new.name,
  incdtpriority_order = new.order,
  incdtpriority_descrip = new.description
where ( incdtpriority_id = old.guid );

","
  
-- delete rules

create or replace rule \\"_DELETE\\" as on delete to xm.priority   
  do instead
  
delete from incdtpriority 
where ( incdtpriority_id = old.guid );

)"}',

-- Conditions, Comment, System

'{}', 'Incident Model', true);