-- Pricing Schedule Item

SELECT dropIfExists('VIEW', 'pricingscheduleitem', 'api');
CREATE OR REPLACE VIEW api.pricingscheduleitem AS 
 SELECT 
   ipshead_name::VARCHAR AS pricing_schedule,
   CASE WHEN (COALESCE(ipsitem_item_id, -1) > 0) THEN 'Item'::VARCHAR
        ELSE 'Product Category'::VARCHAR
   END AS type,
   COALESCE(item_number, '')::VARCHAR AS item_number,
   COALESCE(prodcat_code, '')::VARCHAR AS product_category,
   ipsitem_qtybreak AS qty_break, 
   qtyuom.uom_name::VARCHAR AS qty_uom, 
   priceuom.uom_name::VARCHAR AS price_uom,
   ipsitem_price AS price,
   ipsitem_discntprcnt AS percent,
   ipsitem_fixedamtdiscount AS fixedamt,
   CASE WHEN (ipsitem_type='N') THEN 'Nominal'::VARCHAR
        WHEN (ipsitem_type='D') THEN 'Discount'::VARCHAR
        WHEN (ipsitem_type='M') THEN 'Markup'::VARCHAR
   END AS pricing_type 
 FROM ipsiteminfo
   JOIN ipshead ON (ipsitem_ipshead_id = ipshead_id)
   LEFT OUTER JOIN item ON (ipsitem_item_id = item_id)
   LEFT OUTER JOIN prodcat ON (ipsitem_prodcat_id = prodcat_id)
   LEFT OUTER JOIN uom qtyuom ON (ipsitem_qty_uom_id = qtyuom.uom_id)
   LEFT OUTER JOIN uom priceuom ON (ipsitem_price_uom_id = priceuom.uom_id);

GRANT ALL ON TABLE api.pricingscheduleitem TO xtrole;
COMMENT ON VIEW api.pricingscheduleitem IS 'Pricing Schedule Item';

CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO api.pricingscheduleitem DO INSTEAD  
    
 SELECT
   CASE 
     WHEN (NEW.type = 'Item') THEN
       saveIpsitem(NULL,
                   getIpsheadId(NEW.pricing_schedule),
                   getItemId(NEW.item_number),
                   COALESCE(NEW.qty_break,0),
                   COALESCE(NEW.price,0),
                   getUomId(NEW.qty_uom),
                   getUomId(NEW.price_uom),
                   NEW.percent,
                   NEW.fixedamt,
                   CASE NEW.pricing_type WHEN 'Nominal' THEN 'N'
                                         WHEN 'Discount' THEN 'D'
                                         WHEN 'Markup' THEN 'M'
                                         ELSE '?' END)
     WHEN (NEW.type = 'Product Category') THEN
     saveIpsProdcat(NULL,
                    getIpsheadId(NEW.pricing_schedule),
                    getProdcatId(NEW.product_category),
                    NEW.qty_break,
                    NEW.percent,
                    NEW.fixedamt,
                    CASE NEW.pricing_type WHEN 'Nominal' THEN 'N'
                                          WHEN 'Discount' THEN 'D'
                                          WHEN 'Markup' THEN 'M'
                                          ELSE '?' END)
   END;
          
CREATE OR REPLACE RULE "_UPDATE" AS
  ON UPDATE TO api.pricingscheduleitem DO INSTEAD  

 SELECT
   CASE 
     WHEN (OLD.type = 'Item') THEN
       saveIpsitem(getIpsitemId(OLD.pricing_schedule,
                                OLD.item_number,
                                OLD.qty_break,
                                OLD.qty_uom,
                                OLD.price_uom),
                   getIpsheadId(NEW.pricing_schedule),
                   getItemId(NEW.item_number),
                   NEW.qty_break,
                   NEW.price,
                   getUomId(NEW.qty_uom),
                   getUomId(NEW.price_uom),
                   NEW.percent,
                   NEW.fixedamt,
                   CASE NEW.pricing_type WHEN 'Nominal' THEN 'N'
                                         WHEN 'Discount' THEN 'D'
                                         WHEN 'Markup' THEN 'M'
                                         ELSE '?' END)
     WHEN (OLD.type = 'Product Category') THEN
       saveIpsProdcat(getIpsProdcatId(OLD.pricing_schedule,
                                      OLD.product_category,
                                      OLD.qty_break),
                      getIpsheadId(NEW.pricing_schedule),
                      getProdCatId(NEW.product_category),
                      NEW.qty_break,
                      NEW.percent,
                      NEW.fixedamt,
                      CASE NEW.pricing_type WHEN 'Nominal' THEN 'N'
                                            WHEN 'Discount' THEN 'D'
                                            WHEN 'Markup' THEN 'M'
                                            ELSE '?' END)
   END AS result;

CREATE OR REPLACE RULE "_DELETE" AS
  ON DELETE TO api.pricingscheduleitem DO INSTEAD  

 SELECT
   CASE 
     WHEN (OLD.type = 'Item') THEN
       deleteIpsitem(getIpsitemId(OLD.pricing_schedule,
                                  OLD.item_number,
                                  OLD.qty_break,
                                  OLD.qty_uom,
                                  OLD.price_uom))
     WHEN (OLD.type = 'Product Category') THEN
       deleteIpsProdcat(getIpsProdcatId(OLD.pricing_schedule,
                                        OLD.product_category,
                                        OLD.qty_break))
   END AS result;
