-- Sales Order Line Characteristics
SELECT dropIfExists('VIEW', 'saleslinechar', 'api');
CREATE VIEW api.saleslinechar
AS 
SELECT 
  order_number::VARCHAR,
  line_number,
  characteristic,
  COALESCE(si.charass_value,i3.charass_value) AS value,
  COALESCE(si.charass_price,itemcharprice(data.item_id,char_id,COALESCE(si.charass_value,i3.charass_value),cohead_cust_id,cohead_shipto_id,coitem_qtyord,cohead_curr_id,cohead_orderdate),0)::numeric(16,4) AS price
FROM
  (SELECT DISTINCT 
    cohead_cust_id,
    cohead_shipto_id,
    cohead_curr_id,
    cohead_orderdate,
    coitem_id,
    coitem_itemsite_id,
    coitem_qtyord,
    char_id,
    item_id,
    cohead_number AS order_number, 
    CASE 
      WHEN (coitem_subnumber=0) THEN
        coitem_linenumber::VARCHAR
      ELSE 
        coitem_linenumber::VARCHAR || '.'::VARCHAR || coitem_subnumber::VARCHAR
    END AS line_number,
    char_name AS characteristic
   FROM cohead, coitem, itemsite, item, charass, char
   WHERE ( (cohead_id=coitem_cohead_id)
   AND (coitem_itemsite_id=itemsite_id)
   AND (itemsite_item_id=item_id)
   AND (charass_char_id=char_id)
   AND (charass_target_type='I')
   AND (charass_target_id=item_id) ) ) AS data
  LEFT OUTER JOIN charass  si ON ((coitem_id=si.charass_target_id)
                              AND ('SI'=si.charass_target_type)
                              AND (si.charass_char_id=char_id))
  LEFT OUTER JOIN itemsite i1 ON (coitem_itemsite_id=i1.itemsite_id)
  LEFT OUTER JOIN item     i2 ON (i1.itemsite_item_id=i2.item_id)
  LEFT OUTER JOIN charass  i3 ON ((i2.item_id=i3.charass_target_id)
                              AND ('I'=i3.charass_target_type)
                              AND (i3.charass_char_id=char_id)
                              AND (i3.charass_default))
ORDER BY order_number,line_number, characteristic;

GRANT ALL ON TABLE api.saleslinechar TO xtrole;
COMMENT ON VIEW api.saleslinechar IS 'Sales Order Line Item Characteristic';

--Rules

CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO api.saleslinechar DO INSTEAD

SELECT DISTINCT updateCharAssignment('SI', coitem_id, charass_char_id, NEW.value, 
itemcharprice(item_id,char_id,NEW.value,cohead_cust_id,cohead_shipto_id,coitem_qtyord,cohead_curr_id,cohead_orderdate))
FROM cohead, coitem, itemsite, item, charass, char
WHERE ((cohead_number=NEW.order_number)
AND (cohead_id=coitem_cohead_id)
AND (coitem_id=getCoitemId(NEW.order_number,NEW.line_number))
AND (coitem_itemsite_id=itemsite_id)
AND (item_id=itemsite_item_id)
AND (charass_target_type='I')
AND (charass_target_id=item_id)
AND (char_id=charass_char_id)
AND (char_name=NEW.characteristic));

CREATE OR REPLACE RULE "_UPDATE" AS 
    ON UPDATE TO api.saleslinechar DO INSTEAD

SELECT DISTINCT updateCharAssignment('SI', coitem_id, charass_char_id, NEW.value, 
itemcharprice(item_id,char_id,NEW.value,cohead_cust_id,cohead_shipto_id,coitem_qtyord,cohead_curr_id,cohead_orderdate))
FROM cohead, coitem, itemsite, item, charass, char
WHERE ((cohead_number=OLD.order_number)
AND (cohead_id=coitem_cohead_id)
AND (coitem_id=getCoitemId(OLD.order_number,OLD.line_number))
AND (coitem_itemsite_id=itemsite_id)
AND (item_id=itemsite_item_id)
AND (charass_target_type='I')
AND (charass_target_id=item_id)
AND (char_id=charass_char_id)
AND (char_name=OLD.characteristic));

CREATE OR REPLACE RULE "_DELETE" AS 
    ON DELETE TO api.saleslinechar DO INSTEAD NOTHING;
