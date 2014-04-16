-- Quote Line

SELECT dropIfExists('VIEW', 'quoteline', 'api');
CREATE VIEW api.quoteline
AS 
  SELECT 
     quhead_number AS quote_number,
     quitem_linenumber AS line_number,
     l.item_number AS item_number,
     quitem_custpn AS customer_pn,
     i.warehous_code AS sold_from_site,
     quitem_qtyord AS qty_ordered,
     q.uom_name AS qty_uom,
     quitem_price AS net_unit_price,
     p.uom_name AS price_uom,
     quitem_scheddate AS scheduled_date,
     COALESCE((
       SELECT taxtype_name
       FROM taxtype
       WHERE (taxtype_id=getItemTaxType(l.item_id, quhead_taxzone_id))),'None') AS tax_type,
     CASE
       WHEN quitem_price = 0 THEN
         '100'
       WHEN quitem_custprice = 0 THEN
         'N/A'
       ELSE
         CAST(ROUND(((1 - quitem_price / quitem_custprice) * 100),4) AS text)
     END AS discount_pct_from_list,
     quitem_createorder AS create_order,
     s.warehous_code AS supplying_site,
     quitem_prcost AS overwrite_po_price,
     quitem_memo AS notes
  FROM quhead, uom q, uom p, quitem
    LEFT OUTER JOIN whsinfo s ON (quitem_order_warehous_id=s.warehous_id),
  itemsite il, item l, whsinfo i
  WHERE ((quhead_id=quitem_quhead_id)
  AND (quitem_itemsite_id=il.itemsite_id)
  AND (il.itemsite_item_id=l.item_id)
  AND (il.itemsite_warehous_id=i.warehous_id)
  AND (quitem_qty_uom_id=q.uom_id)
  AND (quitem_price_uom_id=p.uom_id))
ORDER BY quhead_number,quitem_linenumber;
    

GRANT ALL ON TABLE api.quoteline TO xtrole;
COMMENT ON VIEW api.quoteline IS 'Quote Line Item';

--Rules

CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO api.quoteline DO INSTEAD

  INSERT INTO quitem (
    quitem_quhead_id,
    quitem_linenumber,
    quitem_itemsite_id,
    quitem_scheddate,
    quitem_qtyord,
    quitem_unitcost,
    quitem_price,
    quitem_custprice,
    quitem_memo,
    quitem_imported,
    quitem_custpn,
    quitem_createorder,
    quitem_order_warehous_id,
    quitem_item_id,
    quitem_prcost,
    quitem_taxtype_id,
    quitem_qty_uom_id,
    quitem_qty_invuomratio,
    quitem_price_uom_id,
    quitem_price_invuomratio)
  SELECT
    getQuoteId(NEW.quote_number),
    COALESCE(NEW.line_number,(
      SELECT (COALESCE(MAX(quitem_linenumber), 0) + 1)
              FROM quitem
              WHERE (quitem_quhead_id=getQuoteId(NEW.quote_number)))),
    itemsite_id,
    COALESCE(NEW.scheduled_date,(
      SELECT MIN(quitem_scheddate)
      FROM quitem
      WHERE (quitem_quhead_id=getQuoteId(NEW.quote_number)))),
    NEW.qty_ordered,
    stdCost(item_id),
    COALESCE(NEW.net_unit_price,itemPrice(getItemId(NEW.item_number),quhead_cust_id,
             quhead_shipto_id,NEW.qty_ordered,quhead_curr_id,quhead_quotedate)),
    itemPrice(getItemId(NEW.item_number),quhead_cust_id,
             quhead_shipto_id,NEW.qty_ordered,quhead_curr_id,quhead_quotedate),
    COALESCE(NEW.notes,''),
    true,
    NEW.customer_pn,
    COALESCE(NEW.create_order,false),
    COALESCE(getWarehousId(NEW.supplying_site,'SHIPPING'),itemsite_warehous_id),
    getItemId(NEW.item_number),
    COALESCE(NEW.overwrite_po_price,0),
    COALESCE(getTaxTypeId(NEW.tax_type), getItemTaxType(itemsite_item_id, quhead_taxzone_id)),
    COALESCE(getUomId(NEW.qty_uom),item_inv_uom_id),
    itemuomtouomratio(item_id,COALESCE(getUomId(NEW.qty_uom),item_inv_uom_id),item_inv_uom_id),
    COALESCE(getUomId(NEW.price_uom),item_price_uom_id),
    itemuomtouomratio(item_id,COALESCE(getUomId(NEW.price_uom),item_price_uom_id),item_price_uom_id)
  FROM quhead, itemsite, item, whsinfo
  WHERE ((quhead_number=NEW.quote_number)
  AND (itemsite_warehous_id=warehous_id
  AND (itemsite_item_id=item_id)
  AND (itemsite_active)
  AND (item_number=NEW.item_number)
  AND (warehous_active)
  AND (warehous_shipping)
  AND (warehous_code=COALESCE(NEW.sold_from_site,(
                                SELECT warehous_code
                                FROM usrpref,whsinfo
                                WHERE ((usrpref_username=getEffectiveXtUser())
                                AND (usrpref_name='PreferredWarehouse')
                                AND (warehous_id=CAST(usrpref_value AS INTEGER))))))));

CREATE OR REPLACE RULE "_UPDATE" AS 
    ON UPDATE TO api.quoteline DO INSTEAD

  UPDATE quitem SET
    quitem_scheddate=NEW.scheduled_date,
    quitem_qtyord=NEW.qty_ordered,
    quitem_qty_uom_id=getUomId(NEW.qty_uom),
    quitem_qty_invuomratio=itemuomtouomratio(item_id,COALESCE(getUomId(NEW.qty_uom),item_inv_uom_id),item_inv_uom_id),
    quitem_price=NEW.net_unit_price,
    quitem_price_uom_id=getUomId(NEW.price_uom),
    quitem_price_invuomratio=itemuomtouomratio(item_id,COALESCE(getUomId(NEW.price_uom),item_inv_uom_id),item_inv_uom_id),
    quitem_memo=NEW.notes,
    quitem_createorder=NEW.create_order,
    quitem_order_warehous_id=getWarehousId(NEW.supplying_site,'SHIPPING'),
    quitem_prcost=NEW.overwrite_po_price,
    quitem_taxtype_id=getTaxTypeId(NEW.tax_type)
   FROM item
   WHERE ((quitem_quhead_id=getQuoteId(OLD.quote_number))
   AND (quitem_linenumber=OLD.line_number));

CREATE OR REPLACE RULE "_DELETE" AS 
    ON DELETE TO api.quoteline DO INSTEAD

  DELETE FROM quitem
  WHERE ((quitem_quhead_id=getQuoteId(OLD.quote_number))
  AND (quitem_linenumber=OLD.line_number));
