-- ProjectTask model view
-- xTuple 4.0 project
-- Mikhail Wall

SELECT dropIfExists('VIEW', 'project_task', 'xm');

-- return rule

CREATE OR REPLACE VIEW xm.project_task AS

SELECT  prjtask_id							AS id,
	prjtask_number							AS "number",
	prjtask_name							AS "name",
	prjtask_descrip							AS notes,
	prjtask_prj_id							AS project,
	CASE prjtask_status
		WHEN 'P' THEN 'planning'
		WHEN 'O' THEN 'open'
		WHEN 'C' THEN 'complete'
	END								AS status,
	COALESCE(prjtask_hours_budget, 0.0)				AS budgeted_hours,
	COALESCE(prjtask_hours_actual, 0.0)				AS actual_hours,
	COALESCE((prjtask_hours_budget - prjtask_hours_actual), 0.0)	AS balance_hours,
	COALESCE(prjtask_exp_budget, 0.00)				AS budgeted_expenses,
	COALESCE(prjtask_exp_actual, 0.00)				AS actual_expenses,
	COALESCE((prjtask_exp_budget - prjtask_exp_actual), 0.00)	AS balance_expenses,
	prjtask_owner_username						AS "owner",
	prjtask_start_date						AS start_date,
	prjtask_due_date						AS due_date,
	prjtask_assigned_date						AS assign_date,
	prjtask_completed_date						AS complete_date,
	prjtask_username						AS assigned_to,
	-- xm.priority not currently implemented in the prjtask table...
	NULL								AS priority,
	-- xm.isActive not currently implemented in the prjtask table...
	NULL								AS is_active,
	BTRIM(ARRAY(
          SELECT comment_id
            FROM "comment"
           WHERE comment_source_id = prjtask_id
	         AND comment_source = 'TA')::TEXT,'{}') 		AS "comments",
	BTRIM(ARRAY(
          SELECT alarm_id
            FROM alarm
           WHERE alarm_source_id = prjtask_id
	         AND alarm_source = 'J')::TEXT,'{}') 			AS alarms
  FROM prjtask;

-- insert rule

CREATE OR REPLACE RULE "_CREATE" AS ON INSERT TO xm.project_task
  DO INSTEAD

INSERT INTO prjtask (
  prjtask_id,
  prjtask_number,
  prjtask_name,
  prjtask_descrip,
  prjtask_prj_id,
  prjtask_status,
  prjtask_hours_budget,
  prjtask_hours_actual,
  prjtask_exp_budget,
  prjtask_exp_actual,
  prjtask_owner_username,
  prjtask_start_date,
  prjtask_due_date,
  prjtask_assigned_date,
  prjtask_completed_date,
  prjtask_username)
VALUES (
  new.id,
  new.number,
  new.name,
  new.notes,
  new.project,
  new.status,
  COALESCE(new.budgeted_hours, 0.0),
  COALESCE(new.actual_hours, 0.0),
  COALESCE(new.budgeted_expenses, 0.00),
  COALESCE(new.actual_expenses, 0.00),
  new.owner,
  new.start_date,
  new.due_date,
  new.assign_date,
  new.complete_date,
  new.assigned_to);

-- update rule

CREATE OR REPLACE RULE "_UPDATE" AS ON UPDATE TO xm.project_task
  DO INSTEAD

UPDATE 	prjtask
   SET  prjtask_name			= new.name,
	prjtask_descrip			= new.notes,
	prjtask_status			= CASE new.status
						WHEN 'planning' THEN 'P'
						WHEN 'open'     THEN 'O'
						WHEN 'complete' THEN 'C'
					  END,
	prjtask_hours_budget		= COALESCE(new.budgeted_hours, 0.0),
	prjtask_hours_actual		= COALESCE(new.actual_hours, 0.0),
	prjtask_exp_budget		= COALESCE(new.budgeted_expenses, 0.00),
	prjtask_exp_actual		= COALESCE(new.actual_expenses, 0.00),
	prjtask_owner_username		= new.owner,
	prjtask_start_date		= new.start_date,
	prjtask_due_date		= new.due_date,
	prjtask_assigned_date		= new.assign_date,
	prjtask_completed_date		= new.complete_date,
	prjtask_username		= new.assigned_to
 WHERE 	(prjtask_id			= old.id);

-- delete rule

CREATE OR REPLACE RULE "_DELETE" AS ON DELETE TO xm.project_task
  DO INSTEAD (

DELETE FROM "comment"
 WHERE (comment_source_id = old.id
       AND comment_source = 'TA');

DELETE FROM alarm
 WHERE (alarm_source_id = old.id
       AND alarm_source = 'J');

DELETE FROM prjtask
 WHERE (prjtask_id = old.id);

)