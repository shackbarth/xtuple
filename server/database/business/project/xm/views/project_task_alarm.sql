-- ProjectTaskAlarm model view
-- xTuple 4.0 project
-- Mikhail Wall

SELECT dropIfExists('VIEW', 'project_task_alarm', 'xm');

-- return rule

CREATE OR REPLACE VIEW xm.project_task_alarm AS

SELECT	alarm_id			AS id,
	alarm_source_id			AS project_task,
	alarm_event			AS event,
	alarm_event_recipient		AS event_recipient,
	alarm_email			AS email,
	alarm_email_recipient		AS email_recipient,
	alarm_sysmsg			AS message,
	alarm_sysmsg_recipient		AS message_recipient,
	alarm_trigger			AS "trigger",
	alarm_time			AS "time",
	alarm_time_offset		AS "offset",
	alarm_time_qualifier		AS qualifier
  FROM	alarm
 WHERE	(alarm_source = 'J');

-- insert rule

CREATE OR REPLACE RULE "_CREATE" AS ON INSERT TO xm.project_task_alarm
  DO INSTEAD

INSERT INTO alarm (
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
  alarm_time_qualifier)
VALUES (
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
  new.qualifier);

-- update rule

CREATE OR REPLACE RULE "_UPDATE" AS ON UPDATE TO xm.project_task_alarm
  DO INSTEAD

UPDATE	alarm
   SET	alarm_event			= new.event,
	alarm_event_recipient		= new.event_recipient,
	alarm_email			= new.email,
	alarm_email_recipient		= new.email_recipient,
	alarm_sysmsg			= new.message,
	alarm_sysmsg_recipient		= new.message_recipient,
	alarm_trigger			= new.trigger,
	alarm_time			= new.time,
	alarm_time_offset		= new.offset,
	alarm_time_qualifier		= new.qualifier
 WHERE	alarm_id = old.id;

-- delete rule

CREATE OR REPLACE RULE "_DELETE" AS ON DELETE TO xm.project_task_alarm
  DO INSTEAD

DELETE 	FROM alarm
 WHERE 	(alarm_id = old.id);