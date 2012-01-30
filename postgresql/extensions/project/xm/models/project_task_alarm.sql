select private.create_model(

-- Model name, schema, table

'project_task_alarm', 'public', 'alarm',

-- Columns

E'{
  "alarm.alarm_id as guid",
  "alarm.alarm_source_id as project_task",
  "alarm.alarm_event as event",
  "alarm.alarm_event_recipient as event_recipient",
  "alarm.alarm_email as email",
  "alarm.alarm_email_recipient as email_recipient",
  "alarm.alarm_sysmsg as message",
  "alarm.alarm_sysmsg_recipient as message_recipient",
  "alarm.alarm_trigger as trigger",
  "alarm.alarm_time as time",
  "alarm.alarm_time_offset as offset",
  "alarm.alarm_time_qualifier as qualifier"}',

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.project_task_alarm
  do instead

insert into alarm (
  alarm_id,
  alarm_number,
  alarm_source_id,
  alarm_source,
  alarm_event,
  alarm_event_recipient,
  alarm_email,
  alarm_email_recipient,
  alarm_sysmsg,
  alarm_sysmsg_recipient,
  alarm_trigger,
  alarm_time,
  alarm_time_offset,
  alarm_time_qualifier )
values (
  new.guid,
  new.guid,
  new.project_task,
  \'J\',
  new.event,
  new.event_recipient,
  new.email,
  new.email_recipient,
  new.message,
  new.message_recipient,
  new.trigger,
  new.time,
  new.offset,
  new.qualifier );

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.project_task_alarm
  do instead

update alarm set
  alarm_event = new.event,
  alarm_event_recipient = new.event_recipient,
  alarm_email = new.email,
  alarm_email_recipient = new.email_recipient,
  alarm_sysmsg = new.message,
  alarm_sysmsg_recipient = new.message_recipient,
  alarm_trigger = new.trigger,
  alarm_time = new.time,
  alarm_time_offset = new.offset,
  alarm_time_qualifier = new.qualifier
where alarm_id = old.guid;

","

-- delete rule

create or replace rule \\"_DELETE\\" as on delete to xm.project_task_alarm
  do instead

delete from alarm
where (alarm_id = old.guid);

"}',

-- Conditions, Comment, System

E'{"alarm.alarm_source = \'J\'"}','Project Task Alarm Model', true, true);