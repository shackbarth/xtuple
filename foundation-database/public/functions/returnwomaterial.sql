CREATE OR REPLACE FUNCTION returnWoMaterial(INTEGER, NUMERIC, TIMESTAMP WITH TIME ZONE) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pWomatlid ALIAS FOR $1;
  pQty ALIAS FOR $2;
  pGlDistTS ALIAS FOR $3;
  _itemlocSeries INTEGER;

BEGIN

  SELECT NEXTVAL('itemloc_series_seq') INTO _itemlocSeries;
  RETURN returnWoMaterial(pWomatlid, pQty, _itemlocSeries, pGlDistTS);

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION returnWoMaterial(INTEGER, INTEGER, TIMESTAMP WITH TIME ZONE, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pWomatlid ALIAS FOR $1;
  pItemlocSeries ALIAS FOR $2;
  pGlDistTS ALIAS FOR $3;
  pInvhistId ALIAS FOR $4;
  _woNumber TEXT;
  _invhistid INTEGER;
  _itemlocSeries INTEGER;
  _invqty NUMERIC;
  _womatlqty NUMERIC;
  _cost NUMERIC := 0;
  _rows INTEGER;

BEGIN

  _itemlocSeries := 0;

  SELECT invhist_invqty, invhist_invqty * invhist_unitcost INTO _invqty, _cost
  FROM invhist
  WHERE (invhist_id=pInvhistId);

  GET DIAGNOSTICS _rows = ROW_COUNT;
  
  IF (_rows = 0) THEN
    RAISE EXCEPTION 'No transaction found for invhist_id %', pInvhistId;
  END IF;
  
  SELECT itemuomtouom(itemsite_item_id, NULL, womatl_uom_id, _invqty)
    INTO _womatlqty
    FROM womatl, itemsite
    WHERE((womatl_itemsite_id=itemsite_id)
     AND (womatl_id=pWomatlid));

  GET DIAGNOSTICS _rows = ROW_COUNT;
  
  IF (_rows = 0) THEN
    _womatlqty := _invqty;
  END IF;

  IF ( SELECT (
         CASE WHEN (womatl_qtyreq >= 0) THEN
           womatl_qtyiss < _womatlqty
         ELSE
           womatl_qtyiss > _womatlqty
         END )
       FROM womatl
       WHERE ( womatl_id=pWomatlid ) ) THEN
    RETURN pItemlocSeries;
  END IF;

  SELECT formatWoNumber(womatl_wo_id) INTO _woNumber
  FROM womatl
  WHERE (womatl_id=pWomatlid);

  IF (pItemlocSeries = 0) THEN
    SELECT NEXTVAL('itemloc_series_seq') INTO _itemlocSeries;
  ELSE
    _itemlocSeries = pItemlocSeries;
  END IF;

  -- Post the transaction
  SELECT postInvTrans( ci.itemsite_id, 'IM', (_invqty * -1), 
                       'W/O', 'WO', _woNumber, '',
                       ('Return ' || item_number || ' from Work Order'),
                       getPrjAccntId(wo_prj_id, pc.costcat_wip_accnt_id), cc.costcat_asset_accnt_id, _itemlocSeries, pGlDistTS,
                       -- Cost will be ignored by Standard Cost items sites
                       _cost, pInvhistId) INTO _invhistid
    FROM womatl, wo,
         itemsite AS ci, costcat AS cc,
         itemsite AS pi, costcat AS pc,
         item
   WHERE((womatl_itemsite_id=ci.itemsite_id)
     AND (ci.itemsite_costcat_id=cc.costcat_id)
     AND (womatl_wo_id=wo_id)
     AND (wo_itemsite_id=pi.itemsite_id)
     AND (pi.itemsite_costcat_id=pc.costcat_id)
     AND (ci.itemsite_item_id=item_id)
     AND (womatl_id=pWomatlid) );

--  Create linkage to the transaction created
  INSERT INTO womatlpost (womatlpost_womatl_id,womatlpost_invhist_id)
              VALUES (pWomatlid,_invhistid);

--  Decrease the parent W/O's WIP value by the value of the returned components
  UPDATE wo
  SET wo_wipvalue = (wo_wipvalue - (CASE WHEN(itemsite_costmethod IN ('A','J'))
                                              THEN _cost
                                         WHEN(itemsite_costmethod='S')
                                              THEN stdcost(itemsite_item_id) * _invqty
                                         ELSE 0.0 END )),
      wo_postedvalue = (wo_postedvalue - (CASE WHEN(itemsite_costmethod IN ('A','J'))
                                                    THEN _cost
                                               WHEN(itemsite_costmethod='S')
                                                    THEN stdcost(itemsite_item_id) * _invqty
                                               ELSE 0.0 END ))
  FROM womatl, itemsite
  WHERE ( (wo_id=womatl_wo_id)
   AND (womatl_itemsite_id=itemsite_id)
   AND (womatl_id=pWomatlid) );

  UPDATE womatl
  SET womatl_qtyiss = (womatl_qtyiss - _womatlqty),
      womatl_lastreturn = CURRENT_DATE
  WHERE (womatl_id=pWomatlid);

  RETURN _itemlocSeries;
END;
$$ LANGUAGE 'plpgsql';

COMMENT ON FUNCTION returnwomaterial(integer, integer, timestamp with time zone, integer) IS 'Returns material by reversing a specific historical transaction';

select dropIfExists('FUNCTION', 'returnWoMaterial(INTEGER, NUMERIC, INTEGER, TIMESTAMP WITH TIME ZONE)'); 
CREATE OR REPLACE FUNCTION returnWoMaterial(INTEGER, NUMERIC, INTEGER, TIMESTAMP WITH TIME ZONE, BOOLEAN DEFAULT FALSE) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pWomatlid ALIAS FOR $1;
  pQty ALIAS FOR $2;
  pItemlocSeries ALIAS FOR $3;
  pGlDistTS ALIAS FOR $4;
  pReqStdCost ALIAS FOR $5;
  _woNumber TEXT;
  _invhistid INTEGER;
  _itemlocSeries INTEGER;
  _qty NUMERIC;
  _cost NUMERIC := 0;

BEGIN

  _itemlocSeries := 0;
  
  IF ( SELECT (
         CASE WHEN (womatl_qtyreq >= 0) THEN
           womatl_qtyiss < pQty
         ELSE
           womatl_qtyiss > pQty
         END )
       FROM womatl
       WHERE ( womatl_id=pWomatlid ) ) THEN
    RETURN pItemlocSeries;
  END IF;

  SELECT itemuomtouom(itemsite_item_id, womatl_uom_id, NULL, pQty)
    INTO _qty
    FROM womatl, itemsite
   WHERE((womatl_itemsite_id=itemsite_id)
     AND (womatl_id=pWomatlid));
  IF (NOT FOUND) THEN
    _qty := pQty;
  END IF;

  SELECT formatWoNumber(womatl_wo_id) INTO _woNumber
  FROM womatl
  WHERE (womatl_id=pWomatlid);

  IF (pItemlocSeries = 0) THEN
    SELECT NEXTVAL('itemloc_series_seq') INTO _itemlocSeries;
  ELSE
    _itemlocSeries = pItemlocSeries;
  END IF;

  -- Get the cost average
  IF (pReqStdCost) THEN
    SELECT stdcost(itemsite_item_id) * _qty INTO _cost
    FROM womatl, itemsite
    WHERE((womatl_itemsite_id=itemsite_id)
      AND (womatl_id=pWomatlid));
  ELSE
    SELECT SUM(invhist_value_before - invhist_value_after) / SUM(invhist_qoh_before - invhist_qoh_after)  * _qty INTO _cost
    FROM invhist, womatlpost, womatl 
    WHERE((womatlpost_womatl_id=womatl_id) 
     AND (womatlpost_invhist_id=invhist_id) 
     AND (invhist_qoh_before > invhist_qoh_after)
     AND (womatl_id=pWomatlId));
  END IF;

  _cost := COALESCE(_cost, 0); -- make sure it's not a null value

  -- Post the transaction
  SELECT postInvTrans( ci.itemsite_id, 'IM', (_qty * -1), 
                       'W/O', 'WO', _woNumber, '',
                       ('Return ' || item_number || ' from Work Order'),
                       getPrjAccntId(wo_prj_id, pc.costcat_wip_accnt_id), cc.costcat_asset_accnt_id, _itemlocSeries, pGlDistTS,
                       -- Cost will be ignored by Standard Cost items sites
                       _cost) INTO _invhistid
    FROM womatl, wo,
         itemsite AS ci, costcat AS cc,
         itemsite AS pi, costcat AS pc,
         item
   WHERE((womatl_itemsite_id=ci.itemsite_id)
     AND (ci.itemsite_costcat_id=cc.costcat_id)
     AND (womatl_wo_id=wo_id)
     AND (wo_itemsite_id=pi.itemsite_id)
     AND (pi.itemsite_costcat_id=pc.costcat_id)
     AND (ci.itemsite_item_id=item_id)
     AND (womatl_id=pWomatlid) );

--  Create linkage to the transaction created
  IF (_invhistid != -1) THEN
    INSERT INTO womatlpost (womatlpost_womatl_id,womatlpost_invhist_id)
                VALUES (pWomatlid,_invhistid);
  END IF;

--  Decrease the parent W/O's WIP value by the value of the returned components
  UPDATE wo
  SET wo_wipvalue = (wo_wipvalue - (CASE WHEN(itemsite_costmethod IN ('A','J'))
                                              THEN _cost
                                         WHEN(itemsite_costmethod='S')
                                              THEN stdcost(itemsite_item_id) * _qty
                                         ELSE 0.0 END )),
      wo_postedvalue = (wo_postedvalue - (CASE WHEN(itemsite_costmethod IN ('A','J'))
                                                    THEN _cost
                                               WHEN(itemsite_costmethod='S')
                                                    THEN stdcost(itemsite_item_id) * _qty
                                               ELSE 0.0 END ))
  FROM womatl, itemsite
  WHERE ( (wo_id=womatl_wo_id)
   AND (womatl_itemsite_id=itemsite_id)
   AND (womatl_id=pWomatlid) );

  UPDATE womatl
  SET womatl_qtyiss = (womatl_qtyiss - pQty),
      womatl_lastreturn = CURRENT_DATE
  WHERE (womatl_id=pWomatlid);

  RETURN _itemlocSeries;

END;
$$ LANGUAGE 'plpgsql';

