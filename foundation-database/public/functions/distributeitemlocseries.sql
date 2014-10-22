CREATE OR REPLACE FUNCTION distributeItemlocSeries(pItemlocSeries INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _distCounter     INTEGER;
  _itemlocdist     RECORD;
  _itemlocid       INTEGER;
  _invhistid       INTEGER;
  _check           BOOLEAN;
  _debug           BOOLEAN := true;
BEGIN

  IF (_debug) THEN
    RAISE NOTICE 'distributeItemlocSeries, series=%', pItemlocSeries;
  END IF;

  _distCounter := 0;

--  March through all of the itemlocdists for pItemlocSeries
  FOR _itemlocdist IN SELECT itemlocdist_id AS itemlocdistid,
                             itemlocdist_source_type AS type,
                             itemlocdist_source_id AS sourceid,
                             itemlocdist_qty AS qty,
                             itemlocdist_itemsite_id AS itemsiteid,
                             itemsite_freeze,
                             itemlocdist_invhist_id AS invhistid,
                             itemlocdist_ls_id AS lotserialid,
                             itemlocdist_expiration AS expiration,
                             itemlocdist_flush,
                             itemlocdist_warranty AS warranty,
                             itemlocdist_series AS series
                      FROM itemlocdist, itemsite
                      WHERE ( (itemlocdist_itemsite_id=itemsite_id)
                       AND (itemlocdist_series=pItemlocSeries) )
                      ORDER BY itemlocdist_flush DESC LOOP

    _distCounter := _distCounter + 1;
    IF (_debug) THEN
      RAISE NOTICE 'itemlocdist loop %', _distCounter;
      RAISE NOTICE 'itemlocdistid=%', _itemlocdist.itemlocdistid;
      RAISE NOTICE 'type=%', _itemlocdist.type;
      RAISE NOTICE 'sourceid=%', _itemlocdist.sourceid;
      RAISE NOTICE 'qty=%', _itemlocdist.qty;
      RAISE NOTICE 'itemsiteid=%', _itemlocdist.itemsiteid;
      RAISE NOTICE 'freeze=%', _itemlocdist.itemsite_freeze;
      RAISE NOTICE 'invhistid=%', _itemlocdist.invhistid;
      RAISE NOTICE 'lotserialid=%', _itemlocdist.lotserialid;
      RAISE NOTICE 'expiration=%', _itemlocdist.expiration;
      RAISE NOTICE 'flush=%', _itemlocdist.itemlocdist_flush;
      RAISE NOTICE 'warranty=%', _itemlocdist.warranty;
    END IF;

--  Commit invhist to itemsite
    IF (NOT _itemlocdist.itemsite_freeze) THEN
	PERFORM postInvHist(_itemlocdist.invhistid);
    END IF;

--  Mark the invhist tuple for the itemlocdist in question as having detail
    UPDATE invhist
    SET invhist_hasdetail=TRUE
    WHERE ( (NOT invhist_hasdetail)
     AND (invhist_id=_itemlocdist.invhistid) );

--  If this itemlocdist is a flush, write a invdetail tuple that records the empty
    IF (_itemlocdist.itemlocdist_flush) THEN
      INSERT INTO invdetail
      ( invdetail_invhist_id, invdetail_location_id, invdetail_ls_id,
        invdetail_qty, invdetail_qty_before, invdetail_qty_after, invdetail_expiration,
        invdetail_warrpurc )
      SELECT _itemlocdist.invhistid, itemloc_location_id, itemloc_ls_id,
             (itemloc_qty * -1), itemloc_qty, 0, itemloc_expiration, 
             _itemlocdist.warranty
      FROM itemloc
      WHERE ( (itemloc_qty <> 0)
       AND (itemloc_id=_itemlocdist.sourceid) );

--  Delete the flushed itemloc if its parent itemsite is not frozen
      IF (NOT _itemlocdist.itemsite_freeze) THEN
        DELETE FROM itemloc
        WHERE (itemloc_id=_itemlocdist.sourceid);
      END IF;

    ELSE
--  If this is a location type distribution, check to see if the target itemloc
--  already exists
      IF (_itemlocdist.type = 'L') THEN
        SELECT itemloc_id INTO _itemlocid
        FROM itemloc
        WHERE ( (itemloc_itemsite_id=_itemlocdist.itemsiteid)
         AND (itemloc_location_id=_itemlocdist.sourceid)
         AND (COALESCE(itemloc_ls_id,-1)=COALESCE(_itemlocdist.lotserialid,-1))
         AND (COALESCE(itemloc_expiration,endOfTime())=COALESCE(_itemlocdist.expiration,endOfTime()))
         AND (COALESCE(itemloc_warrpurc,endoftime())=COALESCE(_itemlocdist.warranty,endoftime())) );

--  Nope, create it
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
        _itemlocid = _itemlocdist.sourceid;

        IF (_itemlocid IS NOT NULL AND (SELECT count(itemloc_id) = 0 FROM itemloc WHERE itemloc_id=_itemlocid)) THEN
          RAISE EXCEPTION 'No record to distribute against. Someone else may have already distributed this record.';
        END IF;
      END IF;

--  Record the invdetail
      INSERT INTO invdetail
      (invdetail_invhist_id, invdetail_location_id, invdetail_ls_id,
       invdetail_qty, invdetail_qty_before, invdetail_qty_after, invdetail_expiration,
       invdetail_warrpurc)
      SELECT _itemlocdist.invhistid, itemloc_location_id, _itemlocdist.lotserialid,
             _itemlocdist.qty, itemloc_qty, (itemloc_qty + _itemlocdist.qty),
             itemloc_expiration,_itemlocdist.warranty
      FROM itemloc
      WHERE (itemloc_id=_itemlocid);

--  Update the itemloc_qty if its parent itemsite is not frozen
      IF (NOT _itemlocdist.itemsite_freeze) THEN
        UPDATE itemloc
        SET itemloc_qty = (itemloc_qty + _itemlocdist.qty)
        WHERE (itemloc_id=_itemlocid);
      END IF;

    END IF;

--  If, after the distribution, the target itemloc_qty = 0, delete the itemloc
--  if its parent itemsite is not frozen
    IF (NOT _itemlocdist.itemsite_freeze) THEN
      DELETE FROM itemloc
      WHERE ( (itemloc_qty=0)
       AND (itemloc_id=_itemlocid) );
    END IF;

  END LOOP;

  DELETE FROM itemlocdist
  WHERE (itemlocdist_series=pItemlocSeries);

  RETURN _distCounter;

END;
$$ LANGUAGE plpgsql;
