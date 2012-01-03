select private.create_model(

-- Model name, schema, table

'state', 'public', 'state',

-- Columns

E'{
  "state.state_id as guid",
  "state.state_name as name",
  "state.state_abbr as abbreviation",
  "state.state_country_id as country"}',
     
-- Rules

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.state
  do instead

insert into public.state (
  state_id,
  state_name,
  state_abbr,
  state_country_id )
values (
  new.guid,
  new.name,
  new.abbreviation,
  new.country );

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.state
  do instead

update public.state set
  state_name = new.name,
  state_abbr = new.abbreviation,
  state_country_id = new.country
where ( state_id = old.guid );

","

-- delete rules

create or replace rule \\"_DELETE\\" as on delete to xm.state
  do instead 
  
delete from public.state
where ( state_id = old.guid );

"}', 

-- Conditions, Comment, System

'{}', 'State Model', true);
