-- Item Source Price View

SELECT dropIfExists('VIEW', 'itemsourceprice', 'api');

CREATE VIEW api.itemsourceprice AS
  SELECT item.item_number::VARCHAR AS item_number, 
	 vendinfo.vend_number::VARCHAR AS vendor, 
         itemsrcp.itemsrcp_qtybreak AS qty_break,
         CASE WHEN (itemsrcp.itemsrcp_type='N') THEN 'Nominal'
              ELSE 'Discount'
         END AS pricing_type,
         CASE WHEN (itemsrcp.itemsrcp_warehous_id=-1) THEN 'All'
              ELSE whsinfo.warehous_code
         END AS pricing_site,
         itemsrcp.itemsrcp_dropship AS dropship_only,
         itemsrcp.itemsrcp_price AS price_per_unit,  
         curr_symbol.curr_abbr AS currency,
         (itemsrcp.itemsrcp_discntprcnt * 100.0) AS discount_percent,
         itemsrcp.itemsrcp_fixedamtdiscount AS discount_fixed_amount
   FROM itemsrcp
   LEFT JOIN itemsrc ON itemsrc.itemsrc_id = itemsrcp.itemsrcp_itemsrc_id
   LEFT JOIN item ON itemsrc.itemsrc_item_id = item.item_id
   LEFT JOIN vendinfo ON itemsrc.itemsrc_vend_id = vendinfo.vend_id
   LEFT JOIN curr_symbol ON itemsrcp.itemsrcp_curr_id = curr_symbol.curr_id
   LEFT JOIN whsinfo ON itemsrcp.itemsrcp_warehous_id = whsinfo.warehous_id
  ORDER BY item.item_number::VARCHAR(100), vendinfo.vend_number::VARCHAR(100);

GRANT ALL ON TABLE api.itemsourceprice TO xtrole;
COMMENT ON VIEW api.itemsourceprice IS 'Item Source Price';

-- Rules

CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO api.itemsourceprice DO INSTEAD

  INSERT INTO itemsrcp (
    itemsrcp_itemsrc_id, 
    itemsrcp_qtybreak, 
    itemsrcp_price, 
    itemsrcp_curr_id,
    itemsrcp_updated,
    itemsrcp_dropship,
    itemsrcp_warehous_id,
    itemsrcp_type,
    itemsrcp_discntprcnt,
    itemsrcp_fixedamtdiscount) 
    VALUES(
    getItemSrcId(new.item_number,new.vendor),
    new.qty_break,
    new.price_per_unit,
    getCurrId(new.currency),
    now(),
    COALESCE(new.dropship_only, FALSE),
    CASE WHEN (new.pricing_site='All') THEN -1
         ELSE COALESCE(getWarehousId(new.pricing_site, 'ALL'), -1) END,
    CASE WHEN (new.pricing_type='Discount') THEN 'D'
         ELSE 'N' END,
    (COALESCE(new.discount_percent, 0.0) / 100.0),
    new.discount_fixed_amount);

CREATE OR REPLACE RULE "_UPDATE" AS 
    ON UPDATE TO api.itemsourceprice DO INSTEAD

  UPDATE itemsrcp SET 
    itemsrcp_qtybreak = new.qty_break, 
    itemsrcp_price = new.price_per_unit,
    itemsrcp_updated = now(), 
    itemsrcp_curr_id = getcurrid(new.currency),
    itemsrcp_dropship=COALESCE(new.dropship_only, FALSE),
    itemsrcp_warehous_id=CASE WHEN (new.pricing_site='All') THEN -1
                              ELSE COALESCE(getWarehousId(new.pricing_site, 'ALL'), -1) END,
    itemsrcp_type=CASE WHEN (new.pricing_type='Discount') THEN 'D'
                       ELSE 'N' END,
    itemsrcp_discntprcnt=(COALESCE(new.discount_percent, 0.0) / 100.0),
    itemsrcp_fixedamtdiscount=new.discount_fixed_amount
  WHERE (itemsrcp_itemsrc_id=getItemSrcId(old.item_number,new.vendor)
  AND (itemsrcp_qtybreak=old.qty_break));

CREATE OR REPLACE RULE "_DELETE" AS 
    ON DELETE TO api.itemsourceprice DO INSTEAD
    
  DELETE FROM itemsrcp
  WHERE (itemsrcp_itemsrc_id=getItemSrcId(old.item_number,old.vendor)
  AND (itemsrcp_qtybreak=old.qty_break));
