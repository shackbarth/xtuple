-- Purchase Order Line Item Comment
SELECT dropifexists('VIEW','purchaselinecomment','API');
CREATE VIEW api.purchaselinecomment
AS 
   SELECT 
     pohead_number::VARCHAR AS order_number,
     poitem_linenumber AS line_number,	
     cmnttype_name AS type,
     comment_date AS date,
     comment_user AS username,
     comment_text AS text
   FROM pohead, poitem, cmnttype, comment
   WHERE ((pohead_id=poitem_pohead_id)
   AND (comment_source='PI')
   AND (comment_source_id=poitem_id)
   AND (comment_cmnttype_id=cmnttype_id))
   ORDER BY pohead_number ASC, poitem_linenumber ASC, comment_date DESC;

GRANT ALL ON TABLE api.purchaselinecomment TO xtrole;
COMMENT ON VIEW api.purchaselinecomment IS 'Purchase Order Line Item Comment';

--Rules

CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO api.purchaselinecomment DO INSTEAD

  INSERT INTO comment (
    comment_date,
    comment_source,
    comment_source_id,
    comment_user,
    comment_cmnttype_id,
    comment_text
    )
  SELECT 
    COALESCE(NEW.date,current_date),
    'PI',
    poitem_id,
    COALESCE(NEW.username,getEffectiveXtUser()),
    getCmntTypeId(NEW.type),
    NEW.text
  FROM poitem, pohead
  WHERE ((pohead_number=NEW.order_number)
  AND (poitem_pohead_id=pohead_id)
  AND (poitem_linenumber=NEW.line_number));

CREATE OR REPLACE RULE "_UPDATE" AS
    ON UPDATE TO api.purchaselinecomment DO INSTEAD NOTHING;

CREATE OR REPLACE RULE "_DELETE" AS
    ON DELETE TO api.purchaselinecomment DO INSTEAD NOTHING;
