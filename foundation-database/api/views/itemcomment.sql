-- Item Comment

SELECT dropIfExists('VIEW', 'itemcomment', 'api');
CREATE VIEW api.itemcomment
AS 
   SELECT 
     item_number::varchar AS item_number,
     cmnttype_name AS type,
     comment_date AS date,
     comment_user AS username,
     comment_text AS text
   FROM item, cmnttype, comment
   WHERE ((comment_source='I')
   AND (comment_source_id=item_id)
   AND (comment_cmnttype_id=cmnttype_id));

GRANT ALL ON TABLE api.itemcomment TO admin;
GRANT ALL ON TABLE api.itemcomment TO xtrole;
COMMENT ON VIEW api.itemcomment IS 'Item Comments';

--Rules

CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO api.itemcomment DO INSTEAD

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
    'IS',
    getItemId(NEW.item_number),
    COALESCE(NEW.username,getEffectiveXtUser()),
    getCmntTypeId(NEW.type),
    NEW.text);

CREATE OR REPLACE RULE "_UPDATE" AS
    ON UPDATE TO api.itemcomment DO INSTEAD NOTHING;

CREATE OR REPLACE RULE "_DELETE" AS
    ON DELETE TO api.itemcomment DO INSTEAD NOTHING;
