-- Sales Order Comment
SELECT dropIfExists('VIEW', 'salesordercomment', 'api');
CREATE VIEW api.salesordercomment
AS 
   SELECT 
     cohead_number::VARCHAR AS order_number,
     cmnttype_name AS type,
     comment_date AS date,
     comment_user AS username,
     comment_text AS text
   FROM cohead, cmnttype, comment
   WHERE ((comment_source='S')
   AND (comment_source_id=cohead_id)
   AND (comment_cmnttype_id=cmnttype_id));

GRANT ALL ON TABLE api.salesordercomment TO xtrole;
COMMENT ON VIEW api.salesordercomment IS 'Sales Order Comment';

--Rules

CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO api.salesordercomment DO INSTEAD

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
    'S',
    getSalesOrderId(NEW.order_number),
    COALESCE(NEW.username,getEffectiveXtUser()),
    getCmntTypeId(NEW.type),
    NEW.text);

CREATE OR REPLACE RULE "_UPDATE" AS
    ON UPDATE TO api.salesordercomment DO INSTEAD NOTHING;

CREATE OR REPLACE RULE "_DELETE" AS
    ON DELETE TO api.salesordercomment DO INSTEAD NOTHING;
