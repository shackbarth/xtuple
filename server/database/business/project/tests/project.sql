-- BEGIN xm. project.sql test queries...

  -- insert rule testing...

	INSERT INTO xm.project (
	  id,
	  "number",
	  "name",
	  notes,
	  "owner",
	  start_date,
	  due_date,
	  assign_date,
	  complete_date,
	  assign_to,
	  project_status)
	VALUES (
	  (SELECT nextval(pg_get_serial_sequence('prj','prj_id'))),
	  '99996',
	  'xm.project insert rule test name',
	  'xm.project insert rule test notes',
	  'admin',
	  now(),
	  now() + interval '45 days',
	  now() + interval '5 days',
	  null,
	  'mike',
	  'P');

	-- used to confirm key value inserted above....
	SELECT currval(pg_get_serial_sequence('prj','prj_id'));

	-- confirm insert into xm.project view
	SELECT *
	  FROM xm.project
	 WHERE id = (SELECT currval(pg_get_serial_sequence('prj','prj_id')));

  -- update rule testing...

	UPDATE xm.project
	   SET 	"name"			= 'xm.project update rule test name',
		notes			= 'xm.project update rule test notes',
		"owner"			= 'testall',
		start_date		= start_date + interval '6 months',
		due_date		= due_date + interval '6 months',
		assign_date		= assign_date + interval '6 months',
		complete_date		= now() + interval '6 months',
		assign_to		= 'web',
		project_status		= 'complete' 
					-- = 'open' -- used to test both remaining options
	 WHERE id = (SELECT currval(pg_get_serial_sequence('prj','prj_id')));

  -- delete rule testing...

	DELETE FROM xm.project
	 WHERE id = (SELECT currval(pg_get_serial_sequence('prj','prj_id')));

-- END xm.project model view testing...

-- BEGIN xm.project_comment model view testing...

   -- insert rule testing...

	INSERT INTO xm.project_comment (
	id,
	project,
	"date",
	"user",
	comment_type,
	"text",
	is_public)
	VALUES (
	(SELECT MAX(comment_id) + 1
	   FROM "comment"),
	133,
	now(),
	'admin',
	1,
	'This text is a test of the project_comment model view INSERT rule...',
	false);

	-- used to confirm key value inserted above....
	SELECT MAX(comment_id)
	  FROM "comment";

	-- confirm insert into xm.project_comment view
	SELECT *
	  FROM xm.project_comment
	 WHERE id = (SELECT MAX(comment_id)
		       FROM "comment");

   -- update rule testing...

	UPDATE 	xm.project_comment
	   SET	"text" = '***This text is a test of the project_comment view UPDATE rule***'
	 WHERE	id = (SELECT MAX(comment_id)
		        FROM "comment");

   -- delete rule testing...(should DO NOTHING)

	DELETE 	FROM xm.project_comment
	WHERE	id = (SELECT MAX(comment_id)
		        FROM "comment");

-- END xm.project_comment model view testing...

-- BEGIN xm.project_task model view testing...

  -- insert rule testing...

	INSERT INTO xm.project_task (
	  id,
	  "number",
	  "name",
	  notes,
	  project,
	  status,
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
	  133,--(SELECT currval(pg_get_serial_sequence('prj','prj_id'))),
	  'P',
	  225,
	  NULL,
	  3000.00,
	  1500.00,
	  'admin',
	  now(),
	  now() + interval '60 days',
	  now() + interval '10 days',
	  NULL,
	  'mike');

	-- used to confirm key value inserted above....
	SELECT currval(pg_get_serial_sequence('prjtask','prjtask_id'));

	-- confirm insert into xm.project view
	SELECT *
	  FROM xm.project_task
	 WHERE id = (SELECT currval(pg_get_serial_sequence('prjtask','prjtask_id')));

  -- update rule testing...

	  UPDATE xm.project_task
	     SET "name"				= '**Updated xm.project_task name**',
		 notes				= '**Udated xm.project_task notes**',
		 project			= (SELECT currval(pg_get_serial_sequence('prj','prj_id'))),
		 budgeted_hours			= 999.00,
		 actual_hours			= 99.99,
		 budgeted_expenses		= 555.55,
		 actual_expenses		= NULL,
		 "owner"			= 'jsmith',
		 start_date			= start_date + interval '12 months',
		 due_date			= due_date + interval '12 months',
		 assign_date			= assign_date + interval '12 months',
		 complete_date			= now() + interval '12 months',
		 assigned_to			= 'shopfloor'
	   WHERE id = (SELECT currval(pg_get_serial_sequence('prjtask','prjtask_id')));

  -- delete rule testing...

	DELETE FROM xm.project_task
	 WHERE id = (SELECT currval(pg_get_serial_sequence('prjtask','prjtask_id')));

-- END xm.project_task model view testing...

-- BEGIN xm.project_task_comment model view testing...

   -- insert rule testing...

	INSERT INTO xm.project_task_comment (
	id,
	project_task,
	"date",
	"user",
	comment_type,
	"text",
	is_public)
	VALUES (
	(SELECT MAX(comment_id) + 1
	   FROM "comment"),
	152,--(SELECT currval(pg_get_serial_sequence('prjtask','prjtask_id'))),
	now(),
	'admin',
	1,
	'This text is a test of the project_task_comment model view INSERT rule...',
	false);

	-- used to confirm key value inserted above....
	SELECT MAX(comment_id)
	  FROM "comment";

	-- confirm insert into xm.project_task_comment view
	SELECT *
	  FROM xm.project_task_comment
	 WHERE id = (SELECT MAX(comment_id)
		       FROM "comment");

   -- update rule testing...

	UPDATE 	xm.project_task_comment
	   SET	"text" = '***This text is a test of the project_task_comment view UPDATE rule***'
	 WHERE	id = (SELECT MAX(comment_id)
		        FROM "comment");

   -- delete rule testing...(should DO NOTHING)

	DELETE 	FROM xm.project_task_comment
	WHERE	id = (SELECT MAX(comment_id)
		        FROM "comment");

-- END xm.project_task_comment model view testing...

-- BEGIN xm.project_task_alarm model view testing...

  -- insert rule testing...

	INSERT INTO xm.project_task_alarm (
	  id,
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
	  152,--(SELECT currval(pg_get_serial_sequence('prjtask','prjtask_id'))),
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
	 WHERE id = 26--(SELECT currval(pg_get_serial_sequence('alarm','alarm_id')));

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
	   WHERE id = 26 --currval(pg_get_serial_sequence('alarm','alarm_id'));

  -- delete rule testing...

	DELETE FROM xm.project_task_alarm
	 WHERE id = 26--(SELECT currval(pg_get_serial_sequence('alarm','alarm_id')));

-- END xm.project_task_alarm model view testing...