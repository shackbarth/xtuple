select private.create_model(

-- Model name, schema, table

'opportunity_stage', 'public', 'opstage',

-- Columns

E'{
  "opstage.opstage_id as guid",
  "opstage.opstage_name as \\"name\\"",
  "opstage.opstage_descrip as description",
  "opstage.opstage_opinactive as deactivate"}',

-- Rules

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.opportunity_stage
  do instead

insert into opstage (
  opstage_id,
  opstage_name,
  opstage_descrip,
  opstage_opinactive )
values (
  new.guid,
  new.name,
  new.description,
  new.deactivate );

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.opportunity_stage
  do instead

update opstage set
  opstage_name = new.name,
  opstage_descrip = new.description,
  opstage_opinactive = new.deactivate
where ( opstage_id = old.guid );

","

-- delete rule

create or replace rule \\"_DELETE\\" as on delete to xm.opportunity_stage
  do instead

delete from opstage
where ( opstage_id = old.guid );

"}',

-- Conditions, Comment, System

'{}', 'Opportunity Stage Model', true);
