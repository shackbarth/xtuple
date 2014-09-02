CREATE OR REPLACE FUNCTION relocateInventory(INTEGER, INTEGER, INTEGER, NUMERIC, TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  RETURN relocateInventory($1, $2, $3, $4, $5, CURRENT_TIMESTAMP);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION relocateInventory(pSourceItemlocid INTEGER,
                                             pTargetLocationid INTEGER,
                                             pItemsiteid INTEGER,
                                             pQty NUMERIC,
                                             pComments TEXT,
                                             pGLDistTS TIMESTAMP WITH TIME ZONE) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _GlDistTS             TIMESTAMP WITH TIME ZONE;
  _targetItemlocid      INTEGER;
  _invhistid            INTEGER;
  _p                    RECORD;
  _rsrv                 RECORD;
  _qty                  NUMERIC;
  _qtyunreserved        NUMERIC := 0.0;
  _qtytomove            NUMERIC := 0.0;
  _result               INTEGER := -1;
  _itemlocSeries        INTEGER := NEXTVAL('itemloc_series_seq');

BEGIN

    IF ((pGlDistTS IS NULL) OR (CAST(pGlDistTS AS date)=CURRENT_DATE)) THEN
      _GlDistTS := CURRENT_TIMESTAMP;
    ELSE
      _GLDistTS := pGLDistTS;
    END IF;

--  Make sure the passed itemsite points to a real item
  IF ( ( SELECT (item_type IN ('R', 'F') OR itemsite_costmethod = 'J')
         FROM itemsite, item
         WHERE ( (itemsite_item_id=item_id)
          AND (itemsite_id=pItemsiteid) ) ) ) THEN
    RETURN 0;
  END IF;

--  Cache some parameters
  SELECT itemloc_ls_id,
         itemloc_itemsite_id AS itemsiteid,
         itemloc_expiration,
         itemloc_warrpurc,
         itemloc_qty INTO _p
  FROM itemloc
  WHERE (itemloc_id=pSourceItemlocid);

--  Check to make sure the qty being transfered exists
  IF (_p.itemloc_qty < pQty) THEN
    RETURN -1;
  END IF;

--  Create the RL transaction
  SELECT NEXTVAL('invhist_invhist_id_seq') INTO _invhistid;
  INSERT INTO invhist
  ( invhist_id, invhist_itemsite_id,
    invhist_transtype, invhist_invqty,
    invhist_qoh_before, invhist_qoh_after,
    invhist_comments,   invhist_transdate,
    invhist_invuom, invhist_unitcost, invhist_costmethod,
    invhist_value_before, invhist_value_after, invhist_series) 
  SELECT _invhistid, itemsite_id,
         'RL', 0,
         itemsite_qtyonhand, itemsite_qtyonhand,
         pComments, _GlDistTS,
         uom_name,
         CASE WHEN (itemsite_costmethod='A') THEN avgcost(itemsite_id)
              ELSE stdCost(item_id)
         END, itemsite_costmethod,
         itemsite_value, itemsite_value, _itemlocSeries
  FROM item, itemsite, uom
  WHERE ((itemsite_item_id=item_id)
   AND (item_inv_uom_id=uom_id)
   AND (itemsite_controlmethod <> 'N')
   AND (itemsite_id=pItemsiteid));

--  Relocate the inventory from the source and record the transactions
  INSERT INTO invdetail
  ( invdetail_invhist_id, invdetail_location_id, invdetail_ls_id,
    invdetail_qty, invdetail_qty_before, invdetail_qty_after,
    invdetail_expiration, invdetail_warrpurc )
  SELECT _invhistid, itemloc_location_id, itemloc_ls_id,
         (pQty * -1), itemloc_qty, (itemloc_qty - pQty),
         itemloc_expiration, itemloc_warrpurc
  FROM itemloc
  WHERE (itemloc_id=pSourceItemlocid);

  UPDATE itemloc
  SET itemloc_qty=(itemloc_qty - pQty)
  FROM itemsite
  WHERE ( (itemloc_itemsite_id=itemsite_id)
   AND (NOT itemsite_freeze)
   AND (itemloc_id=pSourceItemlocid) );

--  Check to see if any of the current Lot/Serial #/Expiration exists at the target location
  SELECT itemloc_id INTO _targetItemlocid
  FROM itemloc 
  WHERE ( (COALESCE(itemloc_ls_id, -1)=COALESCE(_p.itemloc_ls_id,-1))
   AND (COALESCE(itemloc_expiration,endOfTime())=COALESCE(_p.itemloc_expiration,endOfTime()))
   AND (COALESCE(itemloc_warrpurc,endOfTime())=COALESCE(_p.itemloc_warrpurc,endOfTime()))
   AND (itemloc_itemsite_id=pItemsiteid)
   AND (itemloc_location_id=pTargetLocationid) );

  IF (NOT FOUND) THEN
    SELECT NEXTVAL('itemloc_itemloc_id_seq') INTO _targetItemlocid;
    INSERT INTO itemloc
    ( itemloc_id, itemloc_itemsite_id, itemloc_location_id,
      itemloc_ls_id, itemloc_expiration, itemloc_warrpurc, itemloc_qty )
    VALUES
    ( _targetItemlocid, pItemsiteid, pTargetLocationid,
      _p.itemloc_ls_id, _p.itemloc_expiration, _p.itemloc_warrpurc, 0 );
  END IF;

--  Relocate the inventory to the resultant target and record the transactions
  INSERT INTO invdetail
  ( invdetail_invhist_id, invdetail_location_id, invdetail_ls_id,
    invdetail_qty, invdetail_qty_before, invdetail_qty_after,
    invdetail_expiration, invdetail_warrpurc )
  SELECT _invhistid, pTargetLocationid, _p.itemloc_ls_id,
         pQty, itemloc_qty, (itemloc_qty + pQty), 
         _p.itemloc_expiration, _p.itemloc_warrpurc
  FROM itemloc
  WHERE (itemloc_id=_targetItemlocid);

  UPDATE itemloc
  SET itemloc_qty=(itemloc_qty + pQty)
  FROM itemsite
  WHERE ( (itemloc_itemsite_id=itemsite_id)
   AND (NOT itemsite_freeze)
   AND (itemloc_id=_targetItemlocid) );

  UPDATE invhist
  SET invhist_hasdetail=TRUE
  WHERE (invhist_id=_invhistid);

--  Check to see if there is anything left at the target Itemloc and delete if not
--  Could be zero if relocate increased a negative quantity to zero
  DELETE FROM itemloc
  WHERE ( (itemloc_qty=0)
   AND (itemloc_id=_targetItemlocid) );

--  Handle Reservations
  IF (fetchMetricBool('EnableSOReservationsByLocation')) THEN
    SELECT CASE WHEN (qtyReservedLocation(itemloc_id) > itemloc_qty)
                THEN (qtyReservedLocation(itemloc_id) - itemloc_qty)
                ELSE 0.0
                END INTO _qtyunreserved
    FROM itemloc
    WHERE (itemloc_id=pSourceItemlocid);
    -- Move reservations as necessary
    WHILE (_qtyunreserved > 0.0) LOOP
      SELECT * INTO _rsrv
      FROM reserve
      WHERE ((reserve_supply_type='I')
        AND  (reserve_supply_id=pSourceItemlocid))
      ORDER BY reserve_qty;
      IF (NOT FOUND) THEN
        RAISE EXCEPTION 'Cannot find reservation to unreserve.';
      END IF;
      IF (_rsrv.reserve_qty > _qtyunreserved) THEN
        _qtytomove := _qtyunreserved;
      ELSE
        _qtytomove := _rsrv.reserve_qty;
      END IF;
      -- Unreserve Source Location
      SELECT unreserveSOLineQty(_rsrv.reserve_demand_id,
                                _qtytomove,
                                pSourceItemlocid) INTO _result;
      IF (_result < 0) THEN
        RAISE EXCEPTION 'unreserveSOLineQty failed with result=%, reserve_id=%, qty=%',
                        _result, _rsrv.reserve_id, _qtytomove;
      END IF;
      -- Reserve to new Location
      SELECT reserveSOLineQty(_rsrv.reserve_demand_id,
                              TRUE,
                              _qtytomove,
                              _targetItemlocid) INTO _result;
      IF (_result < 0) THEN
        RAISE EXCEPTION 'reserveSOLineQty failed with result=%, reserve_id=%, qty=%',
                        _result, _rsrv.reserve_id, _qtytomove;
      END IF;
      -- Calculate running total
      _qtyunreserved := _qtyunreserved - _qtytomove;
    END LOOP;
  END IF;

--  Check to see if there is anything left at the source Itemloc and delete if not
  DELETE FROM itemloc
  WHERE ( (itemloc_qty=0)
   AND (itemloc_id=pSourceItemlocid) );

--  Return the invhist_id
  RETURN _invhistid;

END;
$$ LANGUAGE plpgsql;
