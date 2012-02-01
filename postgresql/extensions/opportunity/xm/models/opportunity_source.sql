select private.create_model(

-- Model name, schema, table

'opportunity_source', 'public', 'opsource',

-- Columns
E'{
  "opsource.opsource_id as guid",
  "opsource.opsource_name as \\"name\\"",
  "opsource.opsource_descrip as description"}',

-- Rules

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.opportunity_source
  do instead

insert into opsource (
  opsource_id,
  opsource_name,
  opsource_descrip )
values (
  new.guid,
  new.name,
  new.description );

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.opportunity_source
  do instead

update opsource set
  opsource_name = new.name,
  opsource_descrip = new.description
where ( opsource_id = old.guid );

","

-- delete rule

create or replace rule \\"_DELETE\\" as on delete to xm.opportunity_source
  do instead

delete from opsource
where ( opsource_id = old.guid );


"}',

-- Conditions, Comment, System

'{}', 'Opportunity Source Model', true, false, '', '', 'public.opsource_opsource_id_seq');
