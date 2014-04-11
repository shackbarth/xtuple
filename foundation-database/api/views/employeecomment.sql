SELECT dropIfExists('VIEW', 'employeecomment', 'api');
CREATE VIEW api.employeecomment
AS 
   SELECT 
     emp_code::varchar AS code,
     cmnttype_name::varchar AS type,
     comment_date AS date,
     comment_user AS username,
     comment_text AS text
   FROM emp, cmnttype, comment
   WHERE ((comment_source='EMP')
   AND (comment_source_id=emp_id)
   AND (comment_cmnttype_id=cmnttype_id));

GRANT ALL ON TABLE api.employeecomment TO xtrole;
COMMENT ON VIEW api.employeecomment IS 'Employee Comment';

--Rules

CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO api.employeecomment DO INSTEAD

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
    'EMP',
    getEmpId(NEW.code),
    COALESCE(NEW.username,getEffectiveXtUser()),
    getCmntTypeId(NEW.type),
    NEW.text);

CREATE OR REPLACE RULE "_UPDATE" AS
    ON UPDATE TO api.employeecomment DO INSTEAD NOTHING;

CREATE OR REPLACE RULE "_DELETE" AS
    ON DELETE TO api.employeecomment DO INSTEAD NOTHING;
