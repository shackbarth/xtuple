-- Project model view
-- xTuple 4.0 project
-- Mikhail Wall

-- Below statements are used to drop child views as necessary during parent view testing...
/*
SELECT dropIfExists('VIEW', 'project_task_comment', 'xm');
SELECT dropIfExists('VIEW', 'project_task_alarm', 'xm');
SELECT dropIfExists('VIEW', 'project_task', 'xm');
SELECT dropIfExists('VIEW', 'project_comment', 'xm');
*/

SELECT dropIfExists('VIEW', 'project', 'xm');

-- return rule

CREATE OR REPLACE VIEW xm.project AS

SELECT 	prj_id									AS id,
	prj_number								AS "number",
	prj_name								AS "name",
	prj_descrip								AS notes,
	prj_owner_username							AS "owner",
	prj_start_date								AS start_date,
	prj_due_date								AS due_date,
	prj_assigned_date							AS assign_date,
	prj_completed_date							AS complete_date,
	prj_username								AS assign_to,
	NULL									AS priority, -- priority is part of the inherited xt.activity model, but there is no priority field in the prj table...
	CASE prj_status
	     WHEN 'P' THEN 'planning'
	     WHEN 'O' THEN 'open'
	     WHEN 'C' THEN 'complete'
	     ELSE 'undefined'
	END 									AS project_status,
	COALESCE(SUM(prjtask_hours_budget), 0.0)				AS budgeted_hours,
	COALESCE(SUM(prjtask_hours_actual),0.0)				AS acutal_hours,
	COALESCE(SUM(prjtask_hours_budget - prjtask_hours_actual), 0.0)	AS balance_hours,
	COALESCE(SUM(prjtask_exp_budget), 0.0)					AS budgeted_expenses,
	COALESCE(SUM(prjtask_exp_actual),0.0)					AS acutal_expenses,
	COALESCE(SUM(prjtask_exp_budget - prjtask_exp_actual), 0.0)		AS balance_expenses,
	BTRIM(ARRAY(
          SELECT comment_id
            FROM "comment"
           WHERE comment_source_id = prj_id
	         AND comment_source = 'J')::TEXT,'{}') 			AS "comments",
	BTRIM(ARRAY(
          SELECT prjtask_id
            FROM prjtask
           WHERE prjtask_prj_id = prj_id)::TEXT,'{}')				AS tasks,
        BTRIM(ARRAY(
    	  SELECT docass_id 
	    FROM docass
	   WHERE docass_target_id = prj_id 
	     AND docass_target_type = 'J'
	   UNION ALL
	  SELECT docass_id 
	    FROM docass
	   WHERE docass_source_id = prj_id 
	     AND docass_source_type = 'J'
	   UNION ALL
	  SELECT imageass_id 
	    FROM imageass
	   WHERE imageass_source_id = prj_id 
	     AND imageass_source = 'J')::TEXT,'{}') 				AS documents
  FROM 	prj
  LEFT 	OUTER JOIN prjtask ON (prj_id = prjtask_prj_id)
 GROUP 	BY id,
	   "number",
	   "name",
	   notes,
	   "owner",
	   start_date,
	   due_date,
	   assign_date,
	   complete_date,
	   assign_to,
	   priority,
	   project_status,
	   "comments",
	   tasks,
	   documents;

-- insert rule

CREATE OR REPLACE RULE "_CREATE" AS ON INSERT TO xm.project
  DO INSTEAD

INSERT INTO prj (
  prj_id,
  prj_number,
  prj_name,
  prj_descrip,
  prj_owner_username,
  prj_start_date,
  prj_due_date,
  prj_assigned_date,
  prj_completed_date,
  prj_username,
  prj_status)
VALUES (
  new.id,
  new.number,
  new.name,
  new.notes,
  new.owner,
  new.start_date,
  new.due_date,
  new.assign_date,
  new.complete_date,
  new.assign_to,
  new.project_status);

-- update rule

CREATE OR REPLACE RULE "_UPDATE" AS ON UPDATE TO xm.project
  DO INSTEAD

UPDATE 	prj
   SET  prj_name		= new.name,
	prj_descrip		= new.notes,
	prj_owner_username	= new.owner,
	prj_start_date		= new.start_date,
	prj_due_date		= new.due_date,
	prj_assigned_date	= new.assign_date,
	prj_completed_date	= new.complete_date,
	prj_username		= new.assign_to,
	prj_status		= CASE new.project_status
				       WHEN 'planning' THEN 'P'
				       WHEN 'open'     THEN 'O'
				       WHEN 'complete' THEN 'C'
				       ELSE '?'
				  END
 WHERE  prj_id			= old.id;

-- delete rule

CREATE OR REPLACE RULE "_DELETE" AS ON DELETE TO xm.project
  DO INSTEAD (

DELETE FROM "comment"
 WHERE ((comment_source_id IN (	SELECT	prjtask_id
                                 FROM	prjtask
                                WHERE	prjtask_prj_id = old.id)
         OR comment_source_id = old.id)
       AND comment_source IN ('J','TA'));

DELETE FROM prjtask
 WHERE ( prjtask_prj_id = old.id );

DELETE FROM docass
 WHERE (docass_target_id = old.id  
       AND docass_target_type = 'J')
       OR
       (docass_source_id = old.id
       AND docass_source_type = 'J');

--DELETE FROM docass
-- WHERE ( docass_source_id = old.id ) 
--   AND ( docass_source_type = 'J' );

DELETE FROM imageass
 WHERE ( imageass_source_id = old.id
       AND imageass_source = 'J' );

DELETE FROM prj
 WHERE prj_id = old.id;

)