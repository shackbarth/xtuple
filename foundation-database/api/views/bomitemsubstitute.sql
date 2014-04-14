-- Bill of Material Item Substitute

SELECT dropIfExists('VIEW', 'bomitemsubstitute', 'api');
CREATE VIEW api.bomitemsubstitute
AS 
   SELECT 
     bomitem_id,
     p.item_number::varchar AS bom_item_number,
     bomhead_revision::varchar AS bom_revision,
     bomitem_seqnumber AS sequence_number,
     s.item_number::varchar AS substitute_item_number,
     bomitemsub_uomratio AS sub_parent_uom_ratio,
     bomitemsub_rank AS ranking
   FROM item p, item s, bomitem
     LEFT OUTER JOIN bomhead ON ((bomitem_parent_item_id=bomhead_item_id)
                             AND (bomitem_rev_id=bomhead_rev_id)),
     bomitemsub
   WHERE ((p.item_id=bomitem_parent_item_id)
   AND (s.item_id=bomitemsub_item_id)
   AND (bomitemsub_bomitem_id=bomitem_id));

GRANT ALL ON TABLE api.bomitemsubstitute TO xtrole;
COMMENT ON VIEW api.bomitemsubstitute IS 'Bill of Material Item Substitute';

--Rules

CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO api.bomitemsubstitute DO INSTEAD

  INSERT INTO bomitemsub (
    bomitemsub_bomitem_id,
    bomitemsub_item_id,
    bomitemsub_uomratio,
    bomitemsub_rank)
  VALUES (
    NEW.bomitem_id,
    getItemId(NEW.substitute_item_number),
    COALESCE(NEW.sub_parent_uom_ratio,1),
    COALESCE(NEW.ranking,1));

CREATE OR REPLACE RULE "_UPDATE" AS 
    ON UPDATE TO api.bomitemsubstitute DO INSTEAD

  UPDATE bomitemsub SET
    bomitemsub_uomratio=NEW.sub_parent_uom_ratio,
    bomitemsub_rank=NEW.ranking
  WHERE  ((bomitemsub_bomitem_id=OLD.bomitem_id)
  AND (bomitemsub_item_id=getItemId(OLD.substitute_item_number)));
           
CREATE OR REPLACE RULE "_DELETE" AS 
    ON DELETE TO api.bomitemsubstitute DO INSTEAD

  DELETE FROM bomitemsub
  WHERE  ((bomitemsub_bomitem_id=OLD.bomitem_id)
  AND (bomitemsub_item_id=getItemId(OLD.substitute_item_number)));
