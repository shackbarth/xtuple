-- Sales Order Line Item Comment
SELECT dropIfExists('VIEW', 'saleslinecomment', 'api');
CREATE VIEW api.saleslinecomment
AS 
   SELECT 
     cohead_number::VARCHAR AS order_number,
     CASE 
       WHEN (coitem_subnumber=0) THEN
         coitem_linenumber::VARCHAR
       ELSE 
         coitem_linenumber::VARCHAR || '.'::VARCHAR || coitem_subnumber::VARCHAR
     END AS line_number,
     cmnttype_name AS type,
     comment_date AS date,
     comment_user AS username,
     comment_text AS text
   FROM cohead, coitem, cmnttype, comment
   WHERE ((cohead_id=coitem_cohead_id)
   AND (comment_source='SI')
   AND (comment_source_id=coitem_id)
   AND (comment_cmnttype_id=cmnttype_id))
   ORDER BY cohead_number ASC, coitem_linenumber ASC, comment_date DESC;

GRANT ALL ON TABLE api.saleslinecomment TO xtrole;
COMMENT ON VIEW api.saleslinecomment IS 'Sales Order Line Item Comment';

--Rules

CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO api.saleslinecomment DO INSTEAD

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
    'SI',
    getCoitemId(NEW.order_number,NEW.line_number),
    COALESCE(NEW.username,getEffectiveXtUser()),
    getCmntTypeId(NEW.type),
    NEW.text);

CREATE OR REPLACE RULE "_UPDATE" AS
    ON UPDATE TO api.saleslinecomment DO INSTEAD NOTHING;

CREATE OR REPLACE RULE "_DELETE" AS
    ON DELETE TO api.saleslinecomment DO INSTEAD NOTHING;
