-- BEGIN xm. project.sql test queries...

  -- insert rule testing...

	INSERT INTO xm.project (
	  guid,
	  "number",
	  "name",
	  notes,
	  "owner",
	  start_date,
	  due_date,
	  assign_date,
	  complete_date,
	  assigned_to,
	  project_status, 
	  recurrence_period,
	  recurrence_frequency,
	  recurrence_start,
	  recurrence_end,
	  recurrence_max)
	VALUES (
	  9999,
	  '99996',
	  'xm.project insert rule test name',
	  'xm.project insert rule test notes',
	  (select user_account_info from xm.user_account_info where username= 'admin'),
	  now(),
	  now() + interval '45 days',
	  now() + interval '5 days',
	  null,
	  (select user_account_info from xm.user_account_info where username= 'admin'),
	  'P',
	  'W', 1, (current_date + 2)::timestamp with time zone, null, 2);

	-- confirm insert into xm.project view
	SELECT *
	  FROM xm.project
	 WHERE guid = 9999;

  -- update rule testing...

	UPDATE xm.project
	   SET 	"name"			= 'xm.project update rule test name',
		notes			= 'xm.project update rule test notes',
		"owner"			= null,
		start_date		= start_date + interval '6 months',
		due_date		= due_date + interval '6 months',
		assign_date		= assign_date + interval '6 months',
		complete_date		= now() + interval '6 months',
		assigned_to		= null,
		project_status		= 'C' 
					-- = 'open' -- used to test both remaining options
	 WHERE guid = 9999;


-- remove the recurrance

update xm.project set
  recurrence_period = null
where guid = 9999;

-- add a new recurrance
update xm.project set
  recurrence_period = 'M', 
  recurrence_frequency = 1, 
  recurrence_start = (current_date + 4)::timestamp with time zone, 
  recurrence_end = null,
  recurrence_max = 2
where guid = 9999;

-- update the recurrance

update xm.project set
  recurrence_period = 'D', 
  recurrence_frequency = 2, 
  recurrence_start = (current_date + 2)::timestamp with time zone, 
  recurrence_end = null,
  recurrence_max = 3
where guid = 9999;
-- END xm.project model view testing...

-- BEGIN xm.project_comment model view testing...

   -- insert rule testing...

	INSERT INTO xm.project_comment (
	guid,
	project,
	"date",
	"username",
	comment_type,
	"text",
	is_public)
	VALUES (
	(SELECT MAX(comment_id) + 1
	   FROM "comment"),
	(select cmnttype_id from cmnttype where cmnttype_name = 'Sales'),
	now(),
	'admin',
	(select cmnttype_id from cmnttype where cmnttype_name='Sales'),
	'This text is a test of the project_comment model view INSERT rule...',
	false);

	-- used to confirm key value inserted above....
	SELECT MAX(comment_id)
	  FROM "comment";

	-- confirm insert into xm.project_comment view
	SELECT *
	  FROM xm.project_comment
	 WHERE guid = (SELECT MAX(comment_id)
		       FROM "comment");

   -- update rule testing...

	UPDATE 	xm.project_comment
	   SET	"text" 		= '***This text is a test of the project_comment view UPDATE rule***',
		is_public	= true
	 WHERE	guid 		= (SELECT MAX(comment_id)
				     FROM "comment");

   -- delete rule testing...(should DO NOTHING)

	DELETE 	FROM xm.project_comment
	WHERE	guid = (SELECT MAX(comment_id)
		        FROM "comment");

-- END xm.project_comment model view testing...

-- BEGIN xm.project_task model view testing...

  -- insert rule testing...

	INSERT INTO xm.project_task (
	  guid,
	  "number",
	  "name",
	  notes,
	  project,
	  project_task_status,
	  budgeted_hours,
	  actual_hours,
	  budgeted_expenses,
	  actual_expenses,
	  "owner",
	  start_date,
	  due_date,
	  assign_date,
	  complete_date,
	  assigned_to)
	VALUES (
	  (SELECT nextval(pg_get_serial_sequence('prjtask','prjtask_id'))),
	  (SELECT currval(pg_get_serial_sequence('prjtask','prjtask_id'))),
	  'xm.project_task name test',
	  'This text is a test of the project_task model view notes field INSERT rule...',
	  9999,
	  'P',
	  225,
	  NULL,
	  3000.00,
	  1500.00,
	  (select user_account_info from xm.user_account_info where username='admin'),
	  now(),
	  now() + interval '60 days',
	  now() + interval '10 days',
	  NULL,
	  (select user_account_info from xm.user_account_info where username='admin'));

	-- used to confirm key value inserted above....
	SELECT currval(pg_get_serial_sequence('prjtask','prjtask_id'));

	-- confirm insert into xm.project view
	SELECT *
	  FROM xm.project_task
	 WHERE guid = (SELECT currval(pg_get_serial_sequence('prjtask','prjtask_id')));

  -- update rule testing...

	  UPDATE xm.project_task
	     SET "name"				= '**Updated xm.project_task name**',
		 notes				= '**Udated xm.project_task notes**',
		 project			= 9999,
		 budgeted_hours			= 999.00,
		 actual_hours			= 99.99,
		 budgeted_expenses		= 555.55,
		 actual_expenses		= NULL,
		 "owner"			= null,
		 start_date			= start_date + interval '12 months',
		 due_date			= due_date + interval '12 months',
		 assign_date			= assign_date + interval '12 months',
		 complete_date			= now() + interval '12 months',
		 assigned_to			= null
	   WHERE guid = (SELECT currval(pg_get_serial_sequence('prjtask','prjtask_id')));

  -- delete rule testing...

	DELETE FROM xm.project_task
	 WHERE guid = (SELECT currval(pg_get_serial_sequence('prjtask','prjtask_id')));

-- END xm.project_task model view testing...

-- BEGIN xm.project_task_comment model view testing...

   -- insert rule testing...

	INSERT INTO xm.project_task_comment (
	guid,
	project_task,
	"date",
	"username",
	comment_type,
	"text",
	is_public)
	VALUES (
	(SELECT MAX(comment_id) + 1
	   FROM "comment"),
	(SELECT currval(pg_get_serial_sequence('prjtask','prjtask_id'))),
	now(),
	'admin',
	(select cmnttype_id from cmnttype where cmnttype_name = 'Sales'),
	'This text is a test of the project_task_comment model view INSERT rule...',
	false);

	-- used to confirm key value inserted above....
	SELECT MAX(comment_id)
	  FROM "comment";

	-- confirm insert into xm.project_task_comment view
	SELECT *
	  FROM xm.project_task_comment
	 WHERE guid = (SELECT MAX(comment_id)
		       FROM "comment");

   -- update rule testing...

	UPDATE 	xm.project_task_comment
	   SET	"text" = '***This text is a test of the project_task_comment view UPDATE rule***'
	 WHERE	guid = (SELECT MAX(comment_id)
		        FROM "comment");

   -- delete rule testing...(should DO NOTHING)

	DELETE 	FROM xm.project_task_comment
	WHERE	guid = (SELECT MAX(comment_id)
		        FROM "comment");

-- END xm.project_task_comment model view testing...

-- BEGIN xm.project_task_alarm model view testing...

  -- insert rule testing...

	INSERT INTO xm.project_task_alarm (
	  guid,
	  project_task,
	  event,
	  event_recipient,
	  email,
	  email_recipient,
	  message,
	  message_recipient,
	  "trigger",
	  "time",
	  "offset",
	  qualifier)
	VALUES (
	  (SELECT nextval(pg_get_serial_sequence('alarm','alarm_id'))),
	  (SELECT currval(pg_get_serial_sequence('prjtask','prjtask_id'))),
	  false,
	  NULL,
	  false,
	  NULL,
	  false,
	  NULL,
	  now() + INTERVAL '15 days',
	  now() + INTERVAL '1 month',
	  15,
	  'DB');

	-- used to confirm key value inserted above....
	SELECT currval(pg_get_serial_sequence('alarm','alarm_id'));

	-- confirm insert into xm.project view
	SELECT *
	  FROM xm.project_task_alarm
	 WHERE guid = 26; --(SELECT currval(pg_get_serial_sequence('alarm','alarm_id')));

  -- update rule testing...

	  UPDATE xm.project_task_alarm
	     SET event				= true,
		 event_recipient		= 'admin',
		 email				= true,
		 email_recipient		= 'admin',
		 message			= 'true',
		 message_recipient		= 'admin',
		 "trigger"			= now() + INTERVAL '10 days',
		 "time"				= now(),
		 "offset"			= 10,
		 qualifier			= 'DA'
	   WHERE guid = 26; --currval(pg_get_serial_sequence('alarm','alarm_id'));

  -- delete rule testing...

	DELETE FROM xm.project_task_alarm
	 WHERE guid = 26;--(SELECT currval(pg_get_serial_sequence('alarm','alarm_id')));

-- END xm.project_task_alarm model view testing...

  -- delete rule testing...

	DELETE FROM xm.project
	 WHERE number = '99996';