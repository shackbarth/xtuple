-- Quote Comment

SELECT dropIfExists('VIEW', 'quotecomment', 'api');
CREATE VIEW api.quotecomment
AS 
   SELECT 
     quhead_number AS quote_number,
     cmnttype_name AS type,
     comment_date AS date,
     comment_user AS username,
     comment_text AS text
   FROM quhead, cmnttype, comment
   WHERE ((comment_source='Q')
   AND (comment_source_id=quhead_id)
   AND (comment_cmnttype_id=cmnttype_id));

GRANT ALL ON TABLE api.quotecomment TO xtrole;
COMMENT ON VIEW api.quotecomment IS 'Quote Comment';

--Rules

CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO api.quotecomment DO INSTEAD

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
    'Q',
    getQuoteId(NEW.quote_number),
    COALESCE(NEW.username,getEffectiveXtUser()),
    getCmntTypeId(NEW.type),
    NEW.text);

CREATE OR REPLACE RULE "_UPDATE" AS
    ON UPDATE TO api.quotecomment DO INSTEAD NOTHING;

CREATE OR REPLACE RULE "_DELETE" AS
    ON DELETE TO api.quotecomment DO INSTEAD NOTHING;
