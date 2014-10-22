CREATE OR REPLACE FUNCTION distributeToLocations(pItemlocdistid INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _distCounter INTEGER;
  _itemlocdist RECORD;
  _itemlocid INTEGER;
  _runningQty NUMERIC;
  _tmp RECORD;

BEGIN

  _distCounter := 0;
  _runningQty  := 0;

-- A scenario can occur where two people try to post distributions
-- to the same itemsite against two or more lot/serial/mlc locations
-- leading to a deadlock. This line tries to prevent that by locking
-- ahead of time all the itemsites that the transaction will need
-- before any of the other tables are locked individually.
  SELECT itemsite_id
    INTO _tmp
    FROM itemsite
   WHERE(itemsite_id in (SELECT DISTINCT itemlocdist_itemsite_id
                           FROM itemlocdist
                          WHERE(itemlocdist_id=pItemlocdistid)))
     FOR UPDATE;

--  March through all of the itemlocdist owned by the passed parent itemlocdist
  FOR _itemlocdist IN SELECT c.itemlocdist_id AS itemlocdistid,
                             c.itemlocdist_source_type AS type,
                             c.itemlocdist_source_id AS sourceid,
                             c.itemlocdist_qty AS qty,
                             p.itemlocdist_itemsite_id AS itemsiteid,
                             itemsite_freeze,
                             p.itemlocdist_invhist_id AS invhistid,
                             p.itemlocdist_ls_id AS lotserialid,
                             p.itemlocdist_expiration AS expiration,
                             p.itemlocdist_warranty AS warranty,
                             p.itemlocdist_order_type AS ordertype,
                             p.itemlocdist_order_id AS orderid,
                             p.itemlocdist_series AS series
                      FROM itemlocdist AS c, itemlocdist AS p, itemsite
                      WHERE ( (c.itemlocdist_itemlocdist_id=p.itemlocdist_id)
                       AND (p.itemlocdist_source_type='O')
                       AND (p.itemlocdist_itemsite_id=itemsite_id)
                       AND (p.itemlocdist_id=pItemlocdistid) ) LOOP

    _distCounter := _distCounter + 1;

--  If the target for this itemlocdist is a location, check to see if the
--  required itemloc already exists
    IF (_itemlocdist.type = 'L') THEN
      SELECT itemloc_id INTO _itemlocid
      FROM itemloc
      WHERE ( (itemloc_itemsite_id=_itemlocdist.itemsiteid)
       AND (itemloc_location_id=_itemlocdist.sourceid)
       AND (COALESCE(itemloc_ls_id, -1)=COALESCE(_itemlocdist.lotserialid, -1))
       AND (COALESCE(itemloc_expiration,endOfTime())=COALESCE(_itemlocdist.expiration,endOfTime()))
       AND (COALESCE(itemloc_warrpurc,endoftime())=COALESCE(_itemlocdist.warranty,endoftime())) );

--  Nope, make it
      IF (NOT FOUND) THEN
        SELECT NEXTVAL('itemloc_itemloc_id_seq') INTO _itemlocid;
        INSERT INTO itemloc
        ( itemloc_id, itemloc_itemsite_id,
          itemloc_location_id, itemloc_qty,
          itemloc_ls_id, itemloc_expiration,
          itemloc_warrpurc )
        VALUES
        ( _itemlocid, _itemlocdist.itemsiteid,
          _itemlocdist.sourceid, 0,
          _itemlocdist.lotserialid, _itemlocdist.expiration,
          _itemlocdist.warranty );
      END IF;

    ELSE
--  Yep, cache it
      _itemlocid = _itemlocdist.sourceid;

      IF (_itemlocid IS NOT NULL AND (SELECT count(itemloc_id) = 0 FROM itemloc WHERE itemloc_id=_itemlocid)) THEN
        RAISE EXCEPTION 'No record to distribute against. Someone else may have already distributed this record.';
      END IF;
    END IF;

--  Record the invdetail for this itemlocdist
    INSERT INTO invdetail
    ( invdetail_invhist_id, invdetail_location_id, invdetail_ls_id,
      invdetail_qty, invdetail_qty_before, invdetail_qty_after, invdetail_expiration, 
      invdetail_warrpurc )
    SELECT _itemlocdist.invhistid, itemloc_location_id, itemloc_ls_id,
           _itemlocdist.qty, itemloc_qty, (itemloc_qty + _itemlocdist.qty),
           itemloc_expiration,_itemlocdist.warranty
    FROM itemloc
    WHERE (itemloc_id=_itemlocid);

--  Update the parent invhist to indicate that it has invdetail records
    UPDATE invhist
    SET invhist_hasdetail=TRUE
    WHERE ((invhist_hasdetail=FALSE)
     AND (invhist_id=_itemlocdist.invhistid));

--  Update the itemloc_qty if its parent itemsite is not frozen
    IF (NOT _itemlocdist.itemsite_freeze) THEN
      UPDATE itemloc
      SET itemloc_qty = (itemloc_qty + _itemlocdist.qty)
      WHERE (itemloc_id=_itemlocid);

      PERFORM postInvHist(_itemlocdist.invhistid);

--  Handle reservation data
      IF ( (SELECT fetchMetricBool('EnableSOReservationsByLocation')) AND
           (_itemlocdist.qty < 0) ) THEN

--  If a shipment on a sales order, record reservation change before updating
--  so it can be reversed later if necessary
        IF (_itemlocdist.ordertype = 'SO') THEN
          INSERT INTO shipitemlocrsrv
          SELECT nextval('shipitemlocrsrv_shipitemlocrsrv_id_seq'),
            shipitem_id, itemloc_itemsite_id, itemloc_location_id,
            itemloc_ls_id, itemloc_expiration, itemloc_warrpurc,
            least((_itemlocdist.qty * -1.0), reserve_qty)
          FROM shipitem, itemloc
            JOIN reserve ON (itemloc_id=reserve_supply_id AND reserve_supply_type='I')
          WHERE ( (shipitem_invhist_id=_itemlocdist.invhistid)
            AND   (itemloc_id=_itemlocid)
            AND   (reserve_demand_type=_itemlocdist.ordertype)
            AND   (reserve_demand_id=_itemlocdist.orderid) );
        END IF;

--  Update the reservation
        UPDATE reserve
        SET reserve_qty = (reserve_qty + _itemlocdist.qty)
        WHERE ( (reserve_supply_id=_itemlocid)
          AND   (reserve_supply_type='I')
          AND   (reserve_demand_type=_itemlocdist.ordertype)
          AND   (reserve_demand_id=_itemlocdist.orderid) );
          
--  Delete reservation if fully distributed
        DELETE FROM reserve
        WHERE ( (reserve_supply_id=_itemlocid)
          AND   (reserve_supply_type='I')
          AND   (reserve_demand_type=_itemlocdist.ordertype)
          AND   (reserve_demand_id=_itemlocdist.orderid)
          AND   (reserve_qty=0) );
      END IF;
    END IF;

--  Cache the running qty.
    _runningQty := _runningQty + _itemlocdist.qty;

--  Dene with the child itemlocdist, so delete it
    DELETE FROM itemlocdist
    WHERE (itemlocdist_id=_itemlocdist.itemlocdistid);

--  If the target itemloc is now at qty=0, delete it if its parent
--  itemsite is not frozen
    IF (NOT _itemlocdist.itemsite_freeze) THEN
      DELETE FROM itemloc
      WHERE ( (itemloc_qty=0)
       AND (itemloc_id=_itemlocid) );
    END IF;

  END LOOP;

--  If the running qty for the detailed distributions is the same as the
--  total qty to distribute indicated by the parent itemlocdist, then the
--  parent itemlocdist has been fully distributed and should be deleted.
  IF ( ( SELECT itemlocdist_qty
         FROM itemlocdist
         WHERE (itemlocdist_id=pItemlocdistid) ) = _runningQty) THEN
    DELETE FROM itemlocdist
    WHERE (itemlocdist_id=pItemlocdistid);
  ELSE
--  There is still some more qty to distribute in the parent itemlocdist.
--  Update the qty to distribute with the qty that has been distributed.
    UPDATE itemlocdist
    SET itemlocdist_qty = (itemlocdist_qty - _runningQty)
    WHERE (itemlocdist_id=pItemlocdistid);
  END IF;

  RETURN _distCounter;

END;
$$ LANGUAGE plpgsql;
