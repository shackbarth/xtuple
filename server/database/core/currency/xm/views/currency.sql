select private.create_model(

-- Model name, schema, table

'currency', 'public', 'curr_symbol',

-- Columns

E'{
  "curr_symbol.curr_id as guid",
  "curr_symbol.curr_name as name",
  "curr_symbol.curr_symbol as symbol",
  "curr_symbol.curr_abbr as abbreviation",
  "curr_symbol.curr_base as is_base",
  "btrim(array(
    select curr_rate_id 
    from curr_rate
    where curr_rate.curr_id = curr_symbol.curr_id)::text,\'{}\') as rates"
}',

-- Rules

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.currency 
  do instead

insert into public.curr_symbol (
  curr_id,
  curr_name,
  curr_symbol,
  curr_abbr,
  curr_base )
values (
  new.guid,
  new.name,
  new.symbol,
  new.abbreviation,
  new.is_base );

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.currency 
  do instead

update public.curr_symbol set
  curr_name = new.name,
  curr_symbol = new.symbol,
  curr_abbr = new.abbreviation,
  curr_base = new.is_base
where ( curr_id = old.guid );

","

-- delete rules

create or replace rule \\"_DELETE\\" as on delete to xm.currency 
  do instead (

delete from curr_rate
where ( curr_id = old.guid );

delete from public.curr_symbol
where ( curr_id = old.guid );

)

"}',

-- Conditions, Comment, System

'{}', 'Currency Model', true);
