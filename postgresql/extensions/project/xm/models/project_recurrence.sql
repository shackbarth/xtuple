select private.create_model(

-- Model name, schema, table

'project_recurrence', 'public', 'recur',

-- Columns

E'{
  "recur.recur_id as guid",
  "recur.recur_parent_id as project",
  "recur.recur_period as period",
  "recur.recur_freq as frequency",
  "recur.recur_start as start_date",
  "recur.recur_end as end_date",
  "recur.recur_max as maximum"}',

-- Rules

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.project_recurrence
  do instead

insert into recur (
  recur_id,
  recur_parent_id,
  recur_parent_type,
  recur_period,
  recur_freq,
  recur_start,
  recur_end,
  recur_max)
values (
  new.guid,
  new.project,
  \'J\',
  new.period,
  new.frequency,
  new.start_date,
  new.end_date,
  new.maximum );

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.project_recurrence
  do instead

update recur set
  recur_period = new.period,
  recur_freq = new.frequency,
  recur_start = new.start_date,
  recur_end = new.end_date,
  recur_max = new.maximum
where ( recur_id = old.guid );

","

-- delete rule

create or replace rule \\"_DELETE\\" as on delete to xm.project_recurrence 
  do instead

  delete from recur where recur_id = old.guid;

"}', 

-- Conditions, Comment, System, Nested
E'{"recur_parent_type = \'J\'"}', 'Project Recurrence Model', true, true);
