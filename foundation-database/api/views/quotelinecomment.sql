-- Quote Line Item Comment

SELECT dropIfExists('VIEW', 'quotelinecomment', 'api');
CREATE VIEW api.quotelinecomment
AS 
   SELECT 
     quhead_number AS quote_number,
     quitem_linenumber AS line_number,
     cmnttype_name AS type,
     comment_date AS date,
     comment_user AS username,
     comment_text AS text
   FROM quhead, quitem, cmnttype, comment
   WHERE ((quhead_id=quitem_quhead_id)
   AND (comment_source='QI')
   AND (comment_source_id=quitem_id)
   AND (comment_cmnttype_id=cmnttype_id))
   ORDER BY quhead_number ASC, quitem_linenumber ASC, comment_date DESC;

GRANT ALL ON TABLE api.quotelinecomment TO xtrole;
COMMENT ON VIEW api.quotelinecomment IS 'Quote Line Item Comment';

--Rules

CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO api.quotelinecomment DO INSTEAD

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
    'QI',
    getQuoteLineItemId(NEW.quote_number,NEW.line_number),
    COALESCE(NEW.username,getEffectiveXtUser()),
    getCmntTypeId(NEW.type),
    NEW.text);

CREATE OR REPLACE RULE "_UPDATE" AS
    ON UPDATE TO api.quotelinecomment DO INSTEAD NOTHING;

CREATE OR REPLACE RULE "_DELETE" AS
    ON DELETE TO api.quotelinecomment DO INSTEAD NOTHING;
