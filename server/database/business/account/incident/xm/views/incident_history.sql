select private.create_model(

--Model name, schema, table

'incident_history', 'public', 'incdthist',

-- Columns

E'{
  "incdthist.incdthist_id as id",
  "incdthist.incdthist_incdt_id as incident",
  "incdthist.incdthist_timestamp as timestamp",
  "incdthist.incdthist_username as username",
  "incdthist.incdthist_descrip as description"
}',

-- Rules

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.incident_history 
  do instead

insert into incdthist (
  incdthist_id,
  incdthist_incdt_id,  
  incdthist_change,
  incdthist_target_id,
  incdthist_username,
  incdthist_timestamp,
  incdthist_descrip )
values (
  new.id,
  new.incident,
  null,
  null,
  new.username,
  new.timestamp,
  new.description );

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.incident_history
  do instead nothing;

","
  
-- delete rules

create or replace rule \\"_DELETE\\" as on delete to xm.incident_history   
  do instead nothing;

"}',

-- Conditions, Comment, System

'{}', 'Incident History Model', true);
