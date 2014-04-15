CREATE OR REPLACE FUNCTION api.insertSalesLine(api.salesline) RETURNS boolean AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pNEW ALIAS FOR $1;
  _r RECORD;

BEGIN

  IF (NOT EXISTS (SELECT cohead_id FROM cohead WHERE cohead_number=pNEW.order_number)) THEN
    RAISE EXCEPTION 'Function insertSalesLine failed because Sales Order % not found', pNEW.order_number;
  END IF;

  IF (NOT EXISTS (SELECT item_id FROM item WHERE item_number=pNEW.item_number)) THEN
    RAISE EXCEPTION 'Function insertSalesLine failed because Item Number % not found', pNEW.item_number;
  END IF;

  SELECT * INTO _r
  FROM cohead, itemsite, item, whsinfo
  WHERE ((cohead_number=pNEW.order_number)
  AND (itemsite_warehous_id=warehous_id
  AND (itemsite_item_id=item_id)
  AND (itemsite_active)
  AND (item_number=pNEW.item_number)
  AND (warehous_active)
  AND (warehous_id=COALESCE(getWarehousId(pNEW.sold_from_site,'ALL'),cohead_warehous_id,fetchprefwarehousid()))));

  IF (NOT FOUND) THEN
    RAISE EXCEPTION 'Function insertSalesLine failed with unknown failure to retrieve Sales Order';
  END IF;

  INSERT INTO coitem (
    coitem_cohead_id,
    coitem_linenumber,
    coitem_itemsite_id,
    coitem_status,
    coitem_scheddate,
    coitem_promdate,
    coitem_qtyord,
    coitem_qty_uom_id,
    coitem_qty_invuomratio,
    coitem_qtyshipped,
    coitem_unitcost,
    coitem_price,
    coitem_price_uom_id,
    coitem_price_invuomratio,
    coitem_custprice,
    coitem_order_id,
    coitem_memo,
    coitem_imported,
    coitem_qtyreturned,
    coitem_custpn,
    coitem_order_type,
    coitem_substitute_item_id,
    coitem_prcost,
    coitem_taxtype_id,
    coitem_warranty,
    coitem_cos_accnt_id,
    coitem_rev_accnt_id)
  VALUES (
    _r.cohead_id,
    pNEW.line_number::INTEGER,
    _r.itemsite_id,
    pNEW.status,
    pNEW.scheduled_date,
    pNEW.promise_date,
    pNEW.qty_ordered,
    COALESCE(getUomId(pNEW.qty_uom),_r.item_inv_uom_id),
    itemuomtouomratio(_r.item_id,COALESCE(getUomId(pNEW.qty_uom),_r.item_inv_uom_id),_r.item_inv_uom_id),
    0,
    stdCost(_r.item_id),
    COALESCE(pNEW.net_unit_price,itemPrice(_r.item_id,_r.cohead_cust_id,
             _r.cohead_shipto_id,pNEW.qty_ordered,_r.cohead_curr_id,_r.cohead_orderdate)),
    COALESCE(getUomId(pNEW.price_uom),_r.item_price_uom_id),
    itemuomtouomratio(_r.item_id,COALESCE(getUomId(pNEW.price_uom),_r.item_price_uom_id),_r.item_price_uom_id),
    itemPrice(_r.item_id, _r.cohead_cust_id, _r.cohead_shipto_id,
              pNEW.qty_ordered, _r.item_inv_uom_id, _r.item_price_uom_id,
              _r.cohead_curr_id,_r.cohead_orderdate,
              CASE WHEN (fetchMetricText('soPriceEffective') = 'ScheduleDate') THEN pNEW.scheduled_date
                   WHEN (fetchMetricText('soPriceEffective') = 'OrderDate') THEN _r.cohead_orderdate
                   ELSE CURRENT_DATE END,
              NULL)
    -1,
    pNEW.notes,
    true,
    0,
    pNEW.customer_pn,
    CASE
      WHEN ((pNEW.create_order  AND (_r.item_type = 'M')) OR
           ((pNEW.create_order IS NULL) AND _r.itemsite_createwo) AND (NOT _r.itemsite_stocked)) THEN
        'W'
      WHEN ((pNEW.create_order AND (_r.item_type = 'P')) OR
           ((pNEW.create_order IS NULL) AND _r.itemsite_createsopr) AND (NOT _r.itemsite_stocked)) THEN
        'R'
      WHEN ((pNEW.create_order AND (_r.item_type = 'P') AND (_r.itemsite_createsopo)) OR
           ((pNEW.create_order IS NULL) AND _r.itemsite_createsopo) AND (NOT _r.itemsite_stocked)) THEN
        'P'
    END,
    getitemid(pNEW.substitute_for),
    pNEW.overwrite_po_price,
    COALESCE(getTaxTypeId(pNEW.tax_type), getItemTaxType(_r.itemsite_item_id, _r.cohead_taxzone_id)),
    pNEW.warranty,
    getGlAccntId(pNEW.alternate_cos_account),
    getGlAccntId(pNEW.alternate_rev_account)
    );

  RETURN TRUE;
END;
$$ LANGUAGE 'plpgsql';