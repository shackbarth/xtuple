-- Purchase Order Comment
SELECT dropifexists('VIEW', 'purchaseordercomment','API');
CREATE VIEW api.purchaseordercomment
AS 
   SELECT 
     pohead_number::VARCHAR AS order_number,
     cmnttype_name AS type,
     comment_date AS date,
     comment_user AS username,
     comment_text AS text
   FROM pohead, cmnttype, comment
   WHERE ((comment_source='P')
   AND (comment_source_id=pohead_id)
   AND (comment_cmnttype_id=cmnttype_id));

GRANT ALL ON TABLE api.purchaseordercomment TO xtrole;
COMMENT ON VIEW api.purchaseordercomment IS 'Purchase Order Comment';

--Rules

CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO api.purchaseordercomment DO INSTEAD

  INSERT INTO comment (
    comment_date,
    comment_source,
    comment_source_id,
    comment_user,
    comment_cmnttype_id,
    comment_text
    )
  VALUES (
    COALESCE(NEW.date,current_date),
    'P',
    getPoheadId(NEW.order_number),
    COALESCE(NEW.username,getEffectiveXtUser()),
    getCmntTypeId(NEW.type),
    NEW.text);

CREATE OR REPLACE RULE "_UPDATE" AS
    ON UPDATE TO api.purchaseordercomment DO INSTEAD NOTHING;

CREATE OR REPLACE RULE "_DELETE" AS
    ON DELETE TO api.purchaseordercomment DO INSTEAD NOTHING;
