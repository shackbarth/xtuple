
SELECT dropIfExists('VIEW', 'incidentcomment', 'api');

CREATE OR REPLACE VIEW api.incidentcomment AS 
 SELECT incdt.incdt_number AS incident_number, cmnttype.cmnttype_name AS type, comment.comment_date AS date, comment.comment_user AS username, comment.comment_text AS text, comment.comment_public AS public
   FROM incdt, cmnttype, comment
  WHERE comment.comment_source = 'INCDT'::text AND comment.comment_source_id = incdt.incdt_id AND comment.comment_cmnttype_id = cmnttype.cmnttype_id;

GRANT ALL ON TABLE api.incidentcomment TO xtrole;
COMMENT ON VIEW api.incidentcomment IS 'Incident Comment';


-- Rule: "_DELETE" ON api.incidentcomment
-- DROP RULE "_DELETE" ON api.incidentcomment;

CREATE OR REPLACE RULE "_DELETE" AS
    ON DELETE TO api.incidentcomment DO INSTEAD NOTHING;

-- Rule: "_INSERT" ON api.incidentcomment

-- DROP RULE "_INSERT" ON api.incidentcomment;

CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO api.incidentcomment DO INSTEAD  INSERT INTO comment (comment_date, comment_source, comment_source_id, comment_user, comment_cmnttype_id, comment_text, comment_public) 
  VALUES (COALESCE(new.date, now()), 'INCDT'::text, getincidentid(new.incident_number), COALESCE(new.username, getEffectiveXtUser()), getcmnttypeid(new.type), new.text, COALESCE(new.public, true));

-- Rule: "_UPDATE" ON api.incidentcomment

-- DROP RULE "_UPDATE" ON api.incidentcomment;

CREATE OR REPLACE RULE "_UPDATE" AS
    ON UPDATE TO api.incidentcomment DO INSTEAD NOTHING;

