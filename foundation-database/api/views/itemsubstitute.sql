-- Item Substitute

SELECT dropIfExists('VIEW', 'itemsubstitute', 'api');
CREATE VIEW api.itemsubstitute
AS 
   SELECT 
     p.item_number::varchar AS root_item_number,
     s.item_number::varchar AS substitute_item_number,
     itemsub_uomratio AS sub_parent_uom_ratio,
     itemsub_rank AS ranking
   FROM item p, item s, itemsub
   WHERE ((p.item_id=itemsub_parent_item_id)
   AND (s.item_id=itemsub_sub_item_id));

GRANT ALL ON TABLE api.itemsubstitute TO xtrole;
COMMENT ON VIEW api.itemsubstitute IS 'Item Substitute';

--Rules

CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO api.itemsubstitute DO INSTEAD

  INSERT INTO itemsub (
    itemsub_parent_item_id,
    itemsub_sub_item_id,
    itemsub_uomratio,
    itemsub_rank)
  VALUES (
    getItemId(NEW.root_item_number),
    getItemId(NEW.substitute_item_number),
    COALESCE(NEW.sub_parent_uom_ratio,1),
    COALESCE(NEW.ranking,1));

CREATE OR REPLACE RULE "_UPDATE" AS 
    ON UPDATE TO api.itemsubstitute DO INSTEAD

  UPDATE itemsub SET
    itemsub_uomratio=NEW.sub_parent_uom_ratio,
    itemsub_rank=NEW.ranking
  WHERE  ((itemsub_parent_item_id=getItemId(OLD.root_item_number))
  AND (itemsub_sub_item_id=getItemId(OLD.substitute_item_number)));
           
CREATE OR REPLACE RULE "_DELETE" AS 
    ON DELETE TO api.itemsubstitute DO INSTEAD

  DELETE FROM itemsub
  WHERE  ((itemsub_parent_item_id=getItemId(OLD.root_item_number))
  AND (itemsub_sub_item_id=getItemId(OLD.substitute_item_number)));
