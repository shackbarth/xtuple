select dropIfExists('VIEW', 'project_task_alarm', 'xm');

-- return rule

create or replace view xm.project_task_alarm as

select
  alarm_id as id,
  alarm_source_id as project_task,
  alarm_event as event,
  alarm_event_recipient as event_recipient,
  alarm_email as email,
  alarm_email_recipient as email_recipient,
  alarm_sysmsg as message,
  alarm_sysmsg_recipient as message_recipient,
  alarm_trigger as "trigger",
  alarm_time as "time",
  alarm_time_offset as "offset",
  alarm_time_qualifier as qualifier
from alarm
where alarm_source = 'J';

-- insert rule

create or replace rule "_CREATE" as on insert to xm.project_task_alarm
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
  new.id,
  new.id,
  new.project_task,
  'J',
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

-- update rule

create or replace rule "_UPDATE" as on update to xm.project_task_alarm
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
where alarm_id = old.id;

-- delete rule

create or replace rule "_DELETE" as on delete to xm.project_task_alarm
  do instead

delete from alarm
where (alarm_id = old.id);