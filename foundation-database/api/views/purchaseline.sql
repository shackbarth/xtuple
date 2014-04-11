  --Purchase Order Line Item View

  SELECT dropIfExists('VIEW', 'purchaseline', 'api');
  CREATE OR REPLACE VIEW api.purchaseline AS

  SELECT
    pohead_number::varchar AS order_number,
    poitem_linenumber AS line_number,
    item_number,
    warehous_code AS site,
    expcat_code AS expense_category,
    poitem_qty_ordered AS qty_ordered,
    poitem_unitprice AS unit_price,
    poitem_freight AS freight,
    poitem_duedate AS due_date,
    prj_number AS project_number,
    poitem_vend_item_number AS vend_item_number,
    poitem_vend_item_descrip AS vendor_description,
    poitem_manuf_name AS manufacturer_name,
    poitem_manuf_item_number AS manufacturer_item_number,
    poitem_manuf_item_descrip AS manufacturer_description,
    poitem_comments AS notes,
    formatRevNumber('BOM',poitem_bom_rev_id) AS bill_of_materials_revision,
    formatRevNumber('BOO',poitem_boo_rev_id) AS bill_of_operations_revision,
    formatSoNumber(coitem_id) AS sales_order_number,
    formatWoNumber(womatl_wo_id) AS work_order_number
  FROM pohead
    JOIN poitem ON (pohead_id=poitem_pohead_id)
    LEFT OUTER JOIN prj ON (poitem_prj_id=prj_id)
    LEFT OUTER JOIN expcat ON (poitem_expcat_id=expcat_id)
    LEFT OUTER JOIN itemsite ON (poitem_itemsite_id=itemsite_id)
    LEFT OUTER JOIN item ON (itemsite_item_id=item_id)
    LEFT OUTER JOIN whsinfo ON (itemsite_warehous_id=warehous_id)
    LEFT OUTER JOIN coitem ON (coitem_id=poitem_order_id AND poitem_order_type='S')
    LEFT OUTER JOIN womatl ON (womatl_id=poitem_order_id AND poitem_order_type='W')
  ORDER BY pohead_number,poitem_linenumber;
--TODO add label to expense category
GRANT ALL ON TABLE api.purchaseline TO xtrole;
COMMENT ON VIEW api.purchaseline IS 'Purchase Order Line';

  --Rules

  CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO api.purchaseline DO INSTEAD

  INSERT INTO poitem (
    poitem_pohead_id,
    poitem_linenumber,
    poitem_duedate,
    poitem_itemsite_id,
    poitem_vend_item_descrip,
    poitem_qty_ordered,
    poitem_unitprice,
    poitem_vend_item_number,
    poitem_manuf_name,
    poitem_manuf_item_number,
    poitem_manuf_item_descrip,
    poitem_comments,
    poitem_expcat_id,
    poitem_freight,
    poitem_prj_id,
    poitem_bom_rev_id,
    poitem_boo_rev_id) 
  VALUES (
    getPoheadId(NEW.order_number),
    NEW.line_number,
    NEW.due_date,
    getItemsiteId(COALESCE(NEW.site,
     (SELECT warehous_code
      FROM pohead JOIN whsinfo ON (warehous_id=pohead_warehous_id)
      WHERE (pohead_id=getPoheadId(NEW.order_number))),
     (SELECT warehous_code 
      FROM whsinfo
      WHERE (warehous_id=fetchPrefwarehousId())
      )),NEW.item_number),
    NEW.vendor_description,
    NEW.qty_ordered,
    NEW.unit_price,
    NEW.vend_item_number,
    NEW.manufacturer_name,
    NEW.manufacturer_item_number,
    NEW.manufacturer_description,
    NEW.notes,
    getExpcatId(NEW.expense_category),
    NEW.freight,
    getPrjId(NEW.project_number),
    getRevId('BOM',NEW.item_number,NEW.bill_of_materials_revision),
    getRevId('BOO',NEW.item_number,NEW.bill_of_operations_revision));

CREATE OR REPLACE RULE "_INSERT_CHAR" AS
  ON INSERT TO api.purchaseline DO INSTEAD
    
INSERT INTO charass (charass_target_type, charass_target_id, charass_char_id, charass_value)
SELECT 'PI', poitem_id, char_id, charass_value
FROM pohead, poitem, charass, char, itemsite, item
  WHERE ((pohead_number=NEW.order_number)
    AND (poitem_pohead_id=pohead_id)
    AND (poitem_linenumber=NEW.line_number)
    AND (itemsite_id=poitem_itemsite_id)
    AND (itemsite_item_id=item_id)
    AND (charass_target_type='I') 
    AND (charass_target_id=item_id)
    AND (charass_default)
    AND (char_id=charass_char_id));
 
  CREATE OR REPLACE RULE "_UPDATE" AS
  ON UPDATE TO api.purchaseline DO INSTEAD

  UPDATE poitem SET
    poitem_duedate=NEW.due_date,
    poitem_qty_ordered=NEW.qty_ordered,
    poitem_unitprice=NEW.unit_price,
    poitem_vend_item_number=NEW.vend_item_number,
    poitem_vend_item_descrip=NEW.vendor_description,
    poitem_manuf_name=NEW.manufacturer_name,
    poitem_manuf_item_number=NEW.manufacturer_item_number,
    poitem_manuf_item_descrip=NEW.manufacturer_description,
    poitem_comments=NEW.notes,
    poitem_freight=NEW.freight,
    poitem_prj_id=getPrjId(NEW.project_number),
    poitem_bom_rev_id=getRevId('BOM',OLD.item_number,NEW.bill_of_materials_revision),
    poitem_boo_rev_id=getRevId('BOO',OLD.item_number,NEW.bill_of_operations_revision)
  WHERE (poitem_id=getPoitemId(OLD.order_number::text,OLD.line_number));

  CREATE OR REPLACE RULE "_DELETE" AS
  ON DELETE TO api.purchaseline DO INSTEAD

  DELETE FROM poitem
  WHERE (poitem_id=getPoitemId(OLD.order_number::text,OLD.line_number));
