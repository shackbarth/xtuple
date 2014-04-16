-- Quote Line Characteristics

SELECT dropIfExists('VIEW', 'quotelinechar', 'api');
CREATE VIEW api.quotelinechar
AS 
SELECT DISTINCT quhead_number AS quote_number, 
  quitem_linenumber AS line_number,
  char_name AS characteristic,
  COALESCE((
    SELECT b.charass_value 
    FROM charass b 
    WHERE ((b.charass_target_type='QI') 
    AND (b.charass_target_id=quitem_id) 
    AND (b.charass_char_id=char_id))), (
    SELECT c.charass_value 
    FROM charass c 
    WHERE ((c.charass_target_type='I') 
    AND (c.charass_target_id=item_id) 
    AND (c.charass_default) 
    AND (c.charass_char_id=char_id)) LIMIT 1)) AS value
FROM quhead, quitem, itemsite, item, charass a, char
WHERE ( (quhead_id=quitem_quhead_id)
AND (quitem_itemsite_id=itemsite_id)
AND (itemsite_item_id=item_id)
AND (a.charass_char_id=char_id)
AND (a.charass_target_type='I')
AND (a.charass_target_id=item_id) ) 
ORDER BY quhead_number,quitem_linenumber, char_name;

GRANT ALL ON TABLE api.quotelinechar TO xtrole;
COMMENT ON VIEW api.quotelinechar IS 'Quote Line Item Characteristics';

--Rules

CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO api.quotelinechar DO INSTEAD

SELECT DISTINCT updateCharAssignment('QI', quitem_id, charass_char_id, NEW.value)
FROM quhead, quitem, itemsite, item, charass, char
WHERE ((quhead_number=NEW.quote_number)
AND (quhead_id=quitem_quhead_id)
AND (quitem_linenumber=NEW.line_number)
AND (quitem_itemsite_id=itemsite_id)
AND (item_id=itemsite_item_id)
AND (charass_target_type='I')
AND (charass_target_id=item_id)
AND (char_id=charass_char_id)
AND (char_name=NEW.characteristic));

CREATE OR REPLACE RULE "_UPDATE" AS 
    ON UPDATE TO api.quotelinechar DO INSTEAD

SELECT DISTINCT updateCharAssignment('QI', quitem_id, charass_char_id, NEW.value)
FROM quhead, quitem, itemsite, item, charass, char
WHERE ((quhead_number=OLD.quote_number)
AND (quhead_id=quitem_quhead_id)
AND (quitem_linenumber=OLD.line_number)
AND (quitem_itemsite_id=itemsite_id)
AND (item_id=itemsite_item_id)
AND (charass_target_type='I')
AND (charass_target_id=item_id)
AND (char_id=charass_char_id)
AND (char_name=OLD.characteristic));

CREATE OR REPLACE RULE "_DELETE" AS 
    ON DELETE TO api.quotelinechar DO INSTEAD NOTHING;
