-- Pricing Schedule Item Characteristic

SELECT dropIfExists('VIEW', 'pricingscheduleitemchar', 'api');
CREATE VIEW api.pricingscheduleitemchar
AS 
   SELECT 
     ipshead_name::VARCHAR AS pricing_schedule,
     item_number::VARCHAR AS item_number,
     ipsitem_qtybreak AS qty_break,
     qtyuom.uom_name::VARCHAR AS qty_uom,
     priceuom.uom_name::VARCHAR AS price_uom,
     char_name::VARCHAR AS characteristic,
     ipsitemchar_value::VARCHAR AS value,
     ipsitemchar_price AS price
   FROM ipshead, ipsiteminfo, ipsitemchar, item, char, uom qtyuom, uom priceuom
   WHERE ((ipshead_id=ipsitem_ipshead_id)
     AND (ipsitem_id=ipsitemchar_ipsitem_id)
     AND (ipsitem_item_id=item_id)
     AND (ipsitem_qty_uom_id=qtyuom.uom_id)
     AND (ipsitem_price_uom_id=priceuom.uom_id)
     AND (ipsitemchar_char_id=char_id));

GRANT ALL ON TABLE api.pricingscheduleitemchar TO xtrole;
COMMENT ON VIEW api.pricingscheduleitemchar IS 'Pricing Schedule Item Characteristics';

--Rules

CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO api.pricingscheduleitemchar DO INSTEAD

  INSERT INTO ipsitemchar (
    ipsitemchar_ipsitem_id,
    ipsitemchar_char_id,
    ipsitemchar_value,
    ipsitemchar_price
    )
  VALUES (
    getIpsitemId(NEW.pricing_schedule,NEW.item_number,NEW.qty_break,NEW.qty_uom,NEW.price_uom),
    getCharId(NEW.characteristic,'I'),
    NEW.value,
    COALESCE(NEW.price,0));

CREATE OR REPLACE RULE "_UPDATE" AS 
    ON UPDATE TO api.pricingscheduleitemchar DO INSTEAD

  UPDATE ipsitemchar SET
    ipsitemchar_price=NEW.price
  WHERE ((ipsitemchar_ipsitem_id=getIpsitemId(OLD.pricing_schedule,OLD.item_number,OLD.qty_break,OLD.qty_uom,OLD.price_uom))
  AND (ipsitemchar_char_id=getCharId(OLD.characteristic,'I'))
  AND (ipsitemchar_value=OLD.value));
           
CREATE OR REPLACE RULE "_DELETE" AS 
    ON DELETE TO api.pricingscheduleitemchar DO INSTEAD

  DELETE FROM ipsitemchar
  WHERE ((ipsitemchar_ipsitem_id=getIpsitemId(OLD.pricing_schedule,OLD.item_number,OLD.qty_break,OLD.qty_uom,OLD.price_uom))
  AND (ipsitemchar_char_id=getCharId(OLD.characteristic,'I'))
  AND (ipsitemchar_value=OLD.value));
