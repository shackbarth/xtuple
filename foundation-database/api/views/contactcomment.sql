-- Contact Comment

DROP VIEW api.contactcomment;
CREATE VIEW api.contactcomment
AS 
   SELECT 
     cntct_number AS contact_number,
     cmnttype_name AS type,
     comment_date AS date,
     comment_user AS username,
     comment_text AS text
   FROM cntct, cmnttype, comment
   WHERE ((comment_source='T')
   AND (comment_source_id=cntct_id)
   AND (comment_cmnttype_id=cmnttype_id));

GRANT ALL ON TABLE api.contactcomment TO xtrole;
COMMENT ON VIEW api.contactcomment IS 'Contact Comment';

--Rules

CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO api.contactcomment DO INSTEAD

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
    'T',
    getCntctId(NEW.contact_number),
    COALESCE(NEW.username,getEffectiveXtUser()),
    getCmntTypeId(NEW.type),
    NEW.text);

CREATE OR REPLACE RULE "_UPDATE" AS
    ON UPDATE TO api.contactcomment DO INSTEAD NOTHING;

CREATE OR REPLACE RULE "_DELETE" AS
    ON DELETE TO api.contactcomment DO INSTEAD NOTHING;
