-- Item Alias

SELECT dropIfExists('VIEW', 'itemalias', 'api');
CREATE VIEW api.itemalias
AS 
   SELECT 
     item_number::varchar AS item_number,
     itemalias_number AS alias_number,
     itemalias_usedescrip AS use_description,
     itemalias_descrip1 AS description1,
     itemalias_descrip2 AS description2,
     itemalias_comments AS comments
   FROM item, itemalias
   WHERE (item_id=itemalias_item_id);

GRANT ALL ON TABLE api.itemalias TO xtrole;
COMMENT ON VIEW api.itemalias IS 'Item Alias';

--Rules

CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO api.itemalias DO INSTEAD

  INSERT INTO itemalias (
    itemalias_item_id,
    itemalias_number,
    itemalias_usedescrip,
    itemalias_descrip1,
    itemalias_descrip2,
    itemalias_comments)
  VALUES (
    getItemId(NEW.item_number),
    NEW.alias_number,
    COALESCE(NEW.use_description,FALSE),
    COALESCE(NEW.description1,''),
    COALESCE(NEW.description2,''),
    NEW.comments);

CREATE OR REPLACE RULE "_UPDATE" AS 
    ON UPDATE TO api.itemalias DO INSTEAD

  UPDATE itemalias SET
    itemalias_number=NEW.alias_number,
    itemalias_usedescrip=NEW.use_description,
    itemalias_descrip1=NEW.description1,
    itemalias_descrip2=NEW.description2,
    itemalias_comments=NEW.comments
  WHERE  ((itemalias_item_id=getItemId(OLD.item_number))
  AND (itemalias_number=OLD.alias_number));
           
CREATE OR REPLACE RULE "_DELETE" AS 
    ON DELETE TO api.itemalias DO INSTEAD

  DELETE FROM itemalias
  WHERE  ((itemalias_item_id=getItemId(OLD.item_number))
  AND (itemalias_number=OLD.alias_number));
