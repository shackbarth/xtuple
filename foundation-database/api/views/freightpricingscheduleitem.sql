-- Freight Pricing Schedule Item

SELECT dropIfExists('VIEW', 'freightpricingscheduleitem', 'api');
CREATE OR REPLACE VIEW api.freightpricingscheduleitem AS 
 SELECT 
   ipshead_name::VARCHAR AS pricing_schedule, 
   ipsfreight_qtybreak AS qty_break, 
   qtyuom.uom_name::VARCHAR AS qty_uom, 
   ipsfreight_price AS price,
   CASE WHEN (ipsfreight_type='F') THEN 'Flat Rate'
        ELSE 'Price Per UOM'
   END AS price_type,
   COALESCE(warehous_code, 'Any') AS from_site,
   COALESCE(shipzone_name, 'Any') AS to_shipzone,
   COALESCE(ipsfreight_shipvia, 'Any') AS ship_via,
   COALESCE(freightclass_code, 'Any') AS freight_class
 FROM ipsfreight
   JOIN ipshead ON (ipsfreight_ipshead_id = ipshead_id)
   LEFT OUTER JOIN uom qtyuom ON (qtyuom.uom_item_weight)
   LEFT OUTER JOIN whsinfo ON (warehous_id=ipsfreight_warehous_id)
   LEFT OUTER JOIN shipzone ON (shipzone_id=ipsfreight_shipzone_id)
   LEFT OUTER JOIN freightclass ON (freightclass_id=ipsfreight_freightclass_id);

GRANT ALL ON TABLE api.freightpricingscheduleitem TO xtrole;
COMMENT ON VIEW api.freightpricingscheduleitem IS 'Freight Pricing Schedule Item';

CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO api.freightpricingscheduleitem DO INSTEAD  

  INSERT INTO ipsfreight (
    ipsfreight_ipshead_id,
    ipsfreight_qtybreak,
    ipsfreight_price,
    ipsfreight_type,
    ipsfreight_warehous_id,
    ipsfreight_shipzone_id,
    ipsfreight_freightclass_id,
    ipsfreight_shipvia
    )
  VALUES (
    getIpsheadId(NEW.pricing_schedule),
    NEW.qty_break,
    NEW.price,
    CASE WHEN (NEW.price_type = 'Flat Rate') THEN 'F' ELSE 'P' END,
    CASE WHEN (NEW.from_site = 'Any') THEN NULL ELSE getWarehousId(NEW.from_site, 'All') END,
    CASE WHEN (NEW.to_shipzone = 'Any') THEN NULL ELSE getShipzoneId(NEW.to_shipzone) END,
    CASE WHEN (NEW.freight_class = 'Any') THEN NULL ELSE getFreightClassId(NEW.freight_class) END,
    CASE WHEN (NEW.ship_via = 'Any') THEN NULL ELSE NEW.ship_via END
    );
          
CREATE OR REPLACE RULE "_UPDATE" AS
  ON UPDATE TO api.freightpricingscheduleitem DO INSTEAD  

  UPDATE ipsfreight SET
    ipsfreight_ipshead_id = getIpsheadId(OLD.pricing_schedule),
    ipsfreight_qtybreak = NEW.qty_break,
    ipsfreight_price = NEW.price,
    ipsfreight_type = CASE WHEN (NEW.price_type = 'Flat Rate') THEN 'F'
                           WHEN (NEW.price_type = 'Price Per UOM') THEN 'P' END,
    ipsfreight_warehous_id = CASE WHEN (NEW.from_site = 'Any') THEN NULL ELSE getWarehousId(NEW.from_site, 'All') END,
    ipsfreight_shipzone_id = CASE WHEN (NEW.to_shipzone = 'Any') THEN NULL ELSE getShipzoneId(NEW.to_shipzone) END,
    ipsfreight_freightclass_id = CASE WHEN (NEW.freight_class = 'Any') THEN NULL ELSE getFreightClassId(NEW.freight_class) END,
    ipsfreight_shipvia = CASE WHEN (NEW.ship_via = 'Any') THEN NULL ELSE NEW.ship_via END
  WHERE ( (ipsfreight_ipshead_id = getIpsheadId(OLD.pricing_schedule))
    AND   (ipsfreight_qtybreak = OLD.qty_break)
    AND   (ipsfreight_price = OLD.price)
    AND   (ipsfreight_type = CASE WHEN (OLD.price_type = 'Flat Rate') THEN 'F'
                                  WHEN (OLD.price_type = 'Price Per UOM') THEN 'P' END)
    AND  (((ipsfreight_warehous_id IS NULL) AND (OLD.from_site = 'Any'))) OR
          (ipsfreight_warehous_id = CASE WHEN (OLD.from_site = 'Any') THEN 0 ELSE getWarehousId(OLD.from_site, 'All') END)
    AND  (((ipsfreight_shipzone_id IS NULL) AND (OLD.to_shipzone = 'Any'))) OR
          (ipsfreight_shipzone_id = CASE WHEN (OLD.to_shipzone = 'Any') THEN 0 ELSE getShipzoneId(OLD.to_shipzone) END)
    AND  (((ipsfreight_freightclass_id IS NULL) AND (OLD.freight_class = 'Any'))) OR
          (ipsfreight_freightclass_id = CASE WHEN (OLD.freight_class = 'Any') THEN 0 ELSE getFreightClassId(OLD.freight_class) END)
    AND  (((ipsfreight_shipvia IS NULL) AND (OLD.ship_via = 'Any'))) OR
          (ipsfreight_shipvia = OLD.ship_via) );

CREATE OR REPLACE RULE "_DELETE" AS
  ON DELETE TO api.freightpricingscheduleitem DO INSTEAD  

  DELETE FROM ipsfreight
  WHERE ( (ipsfreight_ipshead_id = getIpsheadId(OLD.pricing_schedule))
    AND   (ipsfreight_qtybreak = OLD.qty_break)
    AND   (ipsfreight_price = OLD.price)
    AND   (ipsfreight_type = CASE WHEN (OLD.price_type = 'Flat Rate') THEN 'F'
                                  WHEN (OLD.price_type = 'Price Per UOM') THEN 'P' END)
    AND  (((ipsfreight_warehous_id IS NULL) AND (OLD.from_site = 'Any'))) OR
          (ipsfreight_warehous_id = CASE WHEN (OLD.from_site = 'Any') THEN 0 ELSE getWarehousId(OLD.from_site, 'All') END)
    AND  (((ipsfreight_shipzone_id IS NULL) AND (OLD.to_shipzone = 'Any'))) OR
          (ipsfreight_shipzone_id = CASE WHEN (OLD.to_shipzone = 'Any') THEN 0 ELSE getShipzoneId(OLD.to_shipzone) END)
    AND  (((ipsfreight_freightclass_id IS NULL) AND (OLD.freight_class = 'Any'))) OR
          (ipsfreight_freightclass_id = CASE WHEN (OLD.freight_class = 'Any') THEN 0 ELSE getFreightClassId(OLD.freight_class) END)
    AND  (((ipsfreight_shipvia IS NULL) AND (OLD.ship_via = 'Any'))) OR
          (ipsfreight_shipvia = OLD.ship_via) );
