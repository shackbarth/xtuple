
CREATE OR REPLACE FUNCTION explodeKit(INTEGER, INTEGER, INTEGER, INTEGER, NUMERIC) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pSoheadid ALIAS FOR $1;
  pLinenumber ALIAS FOR $2;
  pSubnumber ALIAS FOR $3;
  pItemsiteid ALIAS FOR $4;
  pQty ALIAS FOR $5;
BEGIN
  RETURN explodeKit(pSoheadid, pLinenumber, pSubnumber, pItemsiteid, pQty, CURRENT_DATE, NULL);
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION explodeKit(INTEGER, INTEGER, INTEGER, INTEGER, NUMERIC, DATE, DATE) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pSoheadid ALIAS FOR $1;
  pLinenumber ALIAS FOR $2;
  pSubnumber ALIAS FOR $3;
  pItemsiteid ALIAS FOR $4;
  pQty ALIAS FOR $5;
  pScheddate ALIAS FOR $6;
  pPromdate ALIAS FOR $7;
BEGIN
  RETURN explodeKit(pSoheadid, pLinenumber, pSubnumber, pItemsiteid, pQty, CURRENT_DATE, NULL, '');
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION explodeKit(INTEGER, INTEGER, INTEGER, INTEGER, NUMERIC, DATE, DATE, TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pSoheadid ALIAS FOR $1;
  pLinenumber ALIAS FOR $2;
  pSubnumber ALIAS FOR $3;
  pItemsiteid ALIAS FOR $4;
  pQty ALIAS FOR $5;
  pScheddate ALIAS FOR $6;
  pPromdate ALIAS FOR $7;
  pMemo ALIAS FOR $8;
  _subnumber INTEGER := COALESCE(pSubnumber,0);
  _revid INTEGER;
  _itemid INTEGER;
  _warehousid INTEGER;
  _item RECORD;
  _type TEXT;
  _coitemid INTEGER;
  _count INTEGER;
  _orderid INTEGER := 0;
  _itemsrcid INTEGER;
BEGIN

  SELECT getActiveRevId('BOM',itemsite_item_id), itemsite_warehous_id, itemsite_item_id
    INTO _revid, _warehousid, _itemid
    FROM itemsite
   WHERE(itemsite_id=pItemsiteid);
  IF(NOT FOUND) THEN
    RAISE EXCEPTION 'No Item Site for the specified line was found.';
  END IF;

  FOR _item IN
  SELECT bomitem_id, 
         itemsite_id,
         itemsite_warehous_id,
         COALESCE((itemsite_active AND item_active), false) AS active,
         COALESCE((itemsite_sold AND item_sold), false) AS sold,
         item_id,
         item_type,
         item_price_uom_id,
         itemsite_createsopr,itemsite_createwo,itemsite_createsopo, itemsite_dropship,
         bomitem_uom_id,
         itemuomtouomratio(item_id, bomitem_uom_id, item_inv_uom_id) AS invuomratio,
         roundQty(itemuomfractionalbyuom(bomitem_item_id, bomitem_uom_id),(bomitem_qtyfxd + bomitem_qtyper * pQty) * (1 + bomitem_scrap)) AS qty
    FROM bomitem JOIN item ON (item_id=bomitem_item_id)
                  LEFT OUTER JOIN itemsite ON ((itemsite_item_id=item_id) AND (itemsite_warehous_id=_warehousid))
   WHERE((bomitem_parent_item_id=_itemid)
     AND (bomitem_rev_id=_revid)
     AND (CURRENT_DATE BETWEEN bomitem_effective AND (bomitem_expires - 1)))
   ORDER BY bomitem_seqnumber LOOP
    IF (NOT _item.active) THEN
      RAISE EXCEPTION 'One or more of the components for the kit is inactive for the selected item site.';
    ELSIF (NOT _item.sold) THEN
      RAISE EXCEPTION 'One or more of the components for the kit is not sold for the selected item site.';
    ELSIF (_item.item_type='F') THEN
      SELECT explodeKit(pSoheadid, pLinenumber, _subnumber, _item.itemsite_id, _item.qty)
        INTO _subnumber;
    ELSE
      IF (_item.itemsite_createsopr) THEN
        _type := 'R';
      ELSIF (_item.itemsite_createsopo) THEN
        _type := 'P';
      ELSIF (_item.itemsite_createwo) THEN
        _type := 'W';
      ELSE
        _type := NULL;
      END IF;
      _subnumber := _subnumber + 1;
      _coitemid = nextval('coitem_coitem_id_seq');
      raise notice 'coitem id: %',_coitemid;
      INSERT INTO coitem
            (coitem_id, coitem_cohead_id,
             coitem_linenumber, coitem_subnumber,
             coitem_itemsite_id, coitem_status,
             coitem_scheddate, coitem_promdate,
             coitem_qtyord, coitem_qty_uom_id, coitem_qty_invuomratio,
             coitem_qtyshipped, coitem_qtyreturned,
             coitem_unitcost, coitem_custprice,
             coitem_price, coitem_price_uom_id, coitem_price_invuomratio,
             coitem_order_type, coitem_order_id,
             coitem_custpn, coitem_memo,
             coitem_prcost)
      VALUES (_coitemid, pSoheadid,
             pLinenumber, _subnumber,
             _item.itemsite_id, 'O',
             pScheddate, pPromdate,
             _item.qty, _item.bomitem_uom_id, _item.invuomratio,
             0, 0,
             stdCost(_item.item_id), 0,
             0, _item.item_price_uom_id, 1,
             _type, -1,
             '', pMemo,
             0);

    END IF;
  END LOOP;

  RETURN _subnumber;
END;
$$ LANGUAGE 'plpgsql';

