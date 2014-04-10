-- Task Comment

SELECT dropIfExists('VIEW', 'taskcomment', 'api');
CREATE VIEW api.taskcomment
AS 
   SELECT 
     prj_number::varchar AS project_number,
     prjtask_number::varchar AS task_number,
     cmnttype_name AS type,
     comment_date AS date,
     comment_user AS username,
     comment_text AS text
   FROM prj, prjtask, cmnttype, comment
   WHERE ((comment_source='TA')
   AND (prj_id=prjtask_prj_id)
   AND (comment_source_id=prjtask_id)
   AND (comment_cmnttype_id=cmnttype_id));

GRANT ALL ON TABLE api.taskcomment TO xtrole;
COMMENT ON VIEW api.taskcomment IS 'Task Comment';

--Rules

CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO api.taskcomment DO INSTEAD

  INSERT INTO comment (
    comment_date,
    comment_source,
    comment_source_id,
    comment_user,
    comment_cmnttype_id,
    comment_text
    )
  VALUES (
    COALESCE(NEW.date,now()),
    'TA',
    getPrjTaskId(NEW.project_number,NEW.task_number),
    COALESCE(NEW.username,getEffectiveXtUser()),
    getCmntTypeId(NEW.type),
    NEW.text);

CREATE OR REPLACE RULE "_UPDATE" AS
    ON UPDATE TO api.taskcomment DO INSTEAD NOTHING;

CREATE OR REPLACE RULE "_DELETE" AS
    ON DELETE TO api.taskcomment DO INSTEAD NOTHING;
