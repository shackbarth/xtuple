-- Purchase Order Line Characteristics
SELECT dropifexists('VIEW','purchaselinechar','API');
CREATE VIEW api.purchaselinechar
AS 
SELECT 
  order_number::VARCHAR,
  line_number,
  characteristic,
  COALESCE(pi.charass_value,i3.charass_value) AS value
FROM
  (SELECT DISTINCT 
    char_id,
    poitem_id,
    poitem_itemsite_id,
    pohead_number AS order_number, 
    poitem_linenumber AS line_number,
    char_name AS characteristic
   FROM pohead, poitem, itemsite, item, charass, char
   WHERE ( (pohead_id=poitem_pohead_id)
   AND (poitem_itemsite_id=itemsite_id)
   AND (itemsite_item_id=item_id)
   AND (charass_char_id=char_id)
   AND (charass_target_type='I')
   AND (charass_target_id=item_id) ) ) AS data
  LEFT OUTER JOIN charass  pi ON ((poitem_id=pi.charass_target_id)
                              AND ('PI'=pi.charass_target_type)
                              AND (pi.charass_char_id=char_id))
  LEFT OUTER JOIN itemsite i1 ON (poitem_itemsite_id=i1.itemsite_id)
  LEFT OUTER JOIN item     i2 ON (i1.itemsite_item_id=i2.item_id)
  LEFT OUTER JOIN charass  i3 ON ((i2.item_id=i3.charass_target_id)
                              AND ('I'=i3.charass_target_type)
                              AND (i3.charass_char_id=char_id)
                              AND (i3.charass_default))
ORDER BY order_number,line_number, characteristic;

GRANT ALL ON TABLE api.purchaselinechar TO xtrole;
COMMENT ON VIEW api.purchaselinechar IS 'Purchase Order Line Item Characteristic';

--Rules

CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO api.purchaselinechar DO INSTEAD

SELECT DISTINCT updateCharAssignment('PI', poitem_id, charass_char_id, NEW.value)
FROM pohead, poitem, itemsite, item, charass, char
WHERE ((pohead_number=NEW.order_number)
AND (pohead_id=poitem_pohead_id)
AND (poitem_linenumber=NEW.line_number)
AND (poitem_itemsite_id=itemsite_id)
AND (item_id=itemsite_item_id)
AND (charass_target_type='I')
AND (charass_target_id=item_id)
AND (char_id=charass_char_id)
AND (char_name=NEW.characteristic));

CREATE OR REPLACE RULE "_UPDATE" AS 
    ON UPDATE TO api.purchaselinechar DO INSTEAD

SELECT DISTINCT updateCharAssignment('PI', poitem_id, charass_char_id, NEW.value)
FROM pohead, poitem, itemsite, item, charass, char
WHERE ((pohead_number=OLD.order_number)
AND (pohead_id=poitem_pohead_id)
AND (poitem_linenumber=OLD.line_number)
AND (poitem_itemsite_id=itemsite_id)
AND (item_id=itemsite_item_id)
AND (charass_target_type='I')
AND (charass_target_id=item_id)
AND (char_id=charass_char_id)
AND (char_name=OLD.characteristic));

CREATE OR REPLACE RULE "_DELETE" AS 
    ON DELETE TO api.purchaselinechar DO INSTEAD NOTHING;
