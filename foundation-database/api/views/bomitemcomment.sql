-- Bill of Material Item Comment

SELECT dropIfExists('VIEW', 'bomitemcomment', 'api');
CREATE VIEW api.bomitemcomment
AS 
   SELECT 
     bomitem_id AS bomitem_id,
     cmnttype_name AS type,
     comment_date AS date,
     comment_user AS username,
     comment_text AS text
   FROM bomitem
     LEFT OUTER JOIN bomhead ON ((bomitem_parent_item_id=bomhead_item_id) 
                             AND (bomitem_rev_id=bomhead_rev_id)),
     item, cmnttype, comment
   WHERE ((comment_source='BMI')
   AND (comment_source_id=bomitem_id)
   AND (comment_cmnttype_id=cmnttype_id)
   AND (bomitem_parent_item_id=item_id))
   ORDER BY item_number,bomhead_revision,bomitem_seqnumber,comment_date;

GRANT ALL ON TABLE api.bomitemcomment TO xtrole;
COMMENT ON VIEW api.bomitemcomment IS 'Bill of Material Comment';

--Rules

CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO api.bomitemcomment DO INSTEAD

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
    'BMI',
    NEW.bomitem_id,
    COALESCE(NEW.username,getEffectiveXtUser()),
    getCmntTypeId(NEW.type),
    NEW.text);

CREATE OR REPLACE RULE "_UPDATE" AS
    ON UPDATE TO api.bomitemcomment DO INSTEAD NOTHING;

CREATE OR REPLACE RULE "_DELETE" AS
    ON DELETE TO api.bomitemcomment DO INSTEAD NOTHING;
