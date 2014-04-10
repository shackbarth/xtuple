-- Project Comment

SELECT dropIfExists('VIEW', 'projectcomment', 'api');
CREATE VIEW api.projectcomment
AS 
   SELECT 
     prj_number::varchar AS project_number,
     cmnttype_name AS type,
     comment_date AS date,
     comment_user AS username,
     comment_text AS text
   FROM prj, cmnttype, comment
   WHERE ((comment_source='J')
   AND (comment_source_id=prj_id)
   AND (comment_cmnttype_id=cmnttype_id));

GRANT ALL ON TABLE api.projectcomment TO xtrole;
COMMENT ON VIEW api.projectcomment IS 'Project Comment';

--Rules

CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO api.projectcomment DO INSTEAD

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
    'J',
    getPrjId(NEW.project_number),
    COALESCE(NEW.username,getEffectiveXtUser()),
    getCmntTypeId(NEW.type),
    NEW.text);

CREATE OR REPLACE RULE "_UPDATE" AS
    ON UPDATE TO api.projectcomment DO INSTEAD NOTHING;

CREATE OR REPLACE RULE "_DELETE" AS
    ON DELETE TO api.projectcomment DO INSTEAD NOTHING;
