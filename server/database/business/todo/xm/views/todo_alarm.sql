select dropIfExists('VIEW', 'todo_alarm', 'xm');

-- return rule

create or replace view xm.todo_alarm as

select
  alarm_id as id,
  alarm_number as "number",
  alarm_email as email,
  alarm_email_recipient as email_recipient,
  alarm_event as event,
  alarm_event_recipient as event_recipient,
  alarm_sysmsg as message,
  alarm_sysmsg_recipient as message_recipient,
  alarm_time_offset as offset,
  alarm_time_qualifier as qualifier,
  alarm_time as time,
  alarm_trigger as trigger,
  alarm_source as source
from alarm
where ( alarm_source = 'TODO' );

-- insert rule

create or replace rule "_CREATE" as on insert to xm.todo_alarm 
  do instead

insert into alarm ( 
  alarm_id,
  alarm_number,
  alarm_email,
  alarm_email_recipient,
  alarm_event,
  alarm_event_recipient,
  alarm_sysmsg,
  alarm_sysmsg_recipient,
  alarm_time_offset,
  alarm_time_qualifier,
  alarm_time,
  alarm_trigger,
  alarm_source )
values (
  new.id,
  new.number,  
  new.email,
  new.email_recipient,
  new.event,
  new.event_recipient,
  new.message,
  new.message_recipient,
  new.offset,
  new.qualifier,
  new.time,
  new.trigger,
  'TODO' );

-- update rule

create or replace rule "_UPDATE" as on update to xm.todo_alarm
  do instead
  
update alarm set
  alarm_number = new.number,
  alarm_email = new.email,
  alarm_email_recipient = new.email_recipient,
  alarm_event = new.event,
  alarm_event_recipient = new.event_recipient,
  alarm_sysmsg = new.message,
  alarm_sysmsg_recipient = new.message_recipient,
  alarm_time_offset = new.offset,
  alarm_time_qualifier = new.qualifier,
  alarm_time = new.time,
  alarm_trigger = new.trigger
where ( alarm_id = old.id );
  
-- delete rules

create or replace rule "_DELETE" as on delete to xm.todo_alarm   
  do instead
  
delete from alarm 
where ( alarm_id = old.id );