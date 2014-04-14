-- Item Site Comment

SELECT dropIfExists('VIEW', 'itemsitecomment', 'api');
CREATE VIEW api.itemsitecomment
AS 
   SELECT 
     item_number::varchar,
     warehous_code::varchar AS site,
     cmnttype_name AS type,
     comment_date AS date,
     comment_user AS username,
     comment_text AS text
   FROM itemsite, item, whsinfo, cmnttype, comment
   WHERE (itemsite_item_id=item_id)
   AND (itemsite_warehous_id=warehous_id
   AND (comment_source='IS')
   AND (comment_source_id=itemsite_id)
   AND (comment_cmnttype_id=cmnttype_id));

GRANT ALL ON TABLE api.itemsitecomment TO admin;
GRANT ALL ON TABLE api.itemsitecomment TO xtrole;
COMMENT ON VIEW api.itemsitecomment IS 'Item Site Comments';

--Rules

CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO api.itemsitecomment DO INSTEAD

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
    getItemSiteId(NEW.site,NEW.item_number),
    COALESCE(NEW.username,getEffectiveXtUser()),
    getCmntTypeId(NEW.type),
    NEW.text);

CREATE OR REPLACE RULE "_UPDATE" AS
    ON UPDATE TO api.itemsitecomment DO INSTEAD NOTHING;

CREATE OR REPLACE RULE "_DELETE" AS
    ON DELETE TO api.itemsitecomment DO INSTEAD NOTHING;
