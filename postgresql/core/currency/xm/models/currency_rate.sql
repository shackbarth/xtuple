select private.create_model(

-- Model name, schema, table

'currency_rate', 'public', 'curr_rate',

-- Columns

E'{
  "curr_rate.curr_rate_id as guid",
  "curr_rate.curr_id as currency",
  "curr_rate.curr_rate as rate",
  "curr_rate.curr_effective as effective",
  "curr_rate.curr_expires as expires"
}',

-- sequence

'public.curr_rate_curr_rate_id_seq',

-- Rules

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.currency_rate 
  do instead

insert into public.curr_rate (
  curr_rate_id,
  curr_id,
  curr_rate,
  curr_effective,
  curr_expires )
values (
  new.guid,
  new.currency,
  new.rate,
  new.effective,
  new.expires );

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.currency_rate
  do instead

update public.curr_rate set
  curr_rate = new.rate,
  curr_effective = new.effective,
  curr_expires = new.expires
where ( curr_rate_id = old.guid );

","

-- delete rules

create or replace rule \\"_DELETE\\" as on delete to xm.currency_rate
  do instead (

delete from public.curr_rate
where ( curr_rate_id = old.guid );

)

"}',

-- Conditions, Comment, System

'{}', 'Currency Rate Model', true, true);
