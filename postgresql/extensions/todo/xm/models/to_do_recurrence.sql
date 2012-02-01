select private.extend_model(

-- Context, name, schema, table, join type, join clause

'postbooks', 'to_do','','recur','left outer join', E'todoitem.todoitem_id=recur_parent_id and recur_parent_type = \'TODO\'',

-- columns

E'{
  "recur.recur_period as recurrence_period",
  "recur.recur_freq as recurrence_frequency",
  "recur.recur_start as recurrence_start",
  "recur.recur_end as recurrence_end",
  "recur.recur_max as recurrence_max"}',

-- rules

E'{"

-- insert rule

create or replace rule \\"_CREATE_RECURRENCE\\" as on insert to xm.to_do
  do instead

insert into recur (
  recur_parent_id,
  recur_parent_type,
  recur_period,
  recur_freq,
  recur_start,
  recur_end,
  recur_max)
values (
  new.guid,
  \'TODO\',
  new.recurrence_period,
  new.recurrence_frequency,
  new.recurrence_start,
  new.recurrence_end,
  new.recurrence_max );

","

create or replace rule \\"_UPDATE_RECURRENCE_CREATE\\" as on update to xm.to_do
  where old.recurrence_period is null and new.recurrence_period is null = false do instead

insert into recur (
  recur_parent_id,
  recur_parent_type,
  recur_period,
  recur_freq,
  recur_start,
  recur_end,
  recur_max)
values (
  new.guid,
  \'TODO\',
  new.recurrence_period,
  new.recurrence_frequency,
  new.recurrence_start,
  new.recurrence_end,
  new.recurrence_max );

","

create or replace rule \\"_UPDATE_RECURRENCE_UPDATE\\" as on update to xm.to_do
  where old.recurrence_period is null = false and new.recurrence_period is null = false do instead

update recur set
  recur_period = new.recurrence_period,
  recur_freq = new.recurrence_frequency,
  recur_start = new.recurrence_start,
  recur_end = new.recurrence_end,
  recur_max = new.recurrence_max
where recur_parent_id = old.guid
  and recur_parent_type = \'TODO\';

","

create or replace rule \\"_UPDATE_RECURRENCE_DELETE\\" as on update to xm.to_do
  where old.recurrence_period is null = false and new.recurrence_period is null do instead

delete from recur
where recur_parent_id = old.guid
  and recur_parent_type = \'TODO\';

"}', 

-- conditions, comment, sequence, system

'{}', 'Extended by Postbooks', 50, true);