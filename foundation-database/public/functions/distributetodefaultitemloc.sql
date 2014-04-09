CREATE OR REPLACE FUNCTION distributeToDefaultItemLoc(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemlocdistid ALIAS FOR $1;

BEGIN

  RETURN distributeToDefaultItemLoc(pItemlocdistid, 'O');

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION distributeToDefaultItemLoc(INTEGER, TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemlocdistid ALIAS FOR $1;
  pTranstype ALIAS FOR $2;
  _itemlocid INTEGER;
  _itemlocdistid INTEGER;
  _qty NUMERIC;

BEGIN

--  Make sure that the itemsite in question has a default location
  SELECT itemloc_id INTO _itemlocid
    FROM itemlocdist, itemsite, itemloc
   WHERE ((itemlocdist_itemsite_id=itemsite_id)
     AND ( (itemsite_location_id=itemloc_location_id AND pTranstype='O') OR
           (itemsite_recvlocation_id=itemloc_location_id AND pTranstype='R') OR
           (itemsite_issuelocation_id=itemloc_location_id AND pTranstype='I') )
     AND (itemloc_itemsite_id=itemsite_id)
     AND (itemlocdist_id=pItemlocdistid));
  IF ( (NOT FOUND) OR (_itemlocid = -1) ) THEN
    RETURN -1;
  END IF;

--  Determine the remaining qty required to distribute
  SELECT (p.itemlocdist_qty - COALESCE(SUM(c.itemlocdist_qty), 0)) INTO _qty
    FROM itemlocdist AS p LEFT OUTER JOIN itemlocdist AS c
      ON (c.itemlocdist_itemlocdist_id=p.itemlocdist_id)
   WHERE (p.itemlocdist_id=pItemlocdistid)
   GROUP BY p.itemlocdist_qty;

  IF (_qty = 0) THEN
    RETURN -2;
  END IF;

--  Check to see if an itemlocdist with the correct location/lotserial/expiration already exists
  SELECT target.itemlocdist_id INTO _itemlocdistid
  FROM itemlocdist AS source, itemlocdist AS target
  WHERE ( (target.itemlocdist_source_type='I')
   AND (target.itemlocdist_source_id=_itemlocid)
   AND (COALESCE(target.itemlocdist_ls_id,-1)=COALESCE(source.itemlocdist_ls_id,-1))
   AND (target.itemlocdist_expiration=source.itemlocdist_expiration)
   AND (target.itemlocdist_itemlocdist_id=source.itemlocdist_id)
   AND (source.itemlocdist_id=pItemlocdistid) );

  IF (FOUND) THEN
    UPDATE itemlocdist
    SET itemlocdist_qty = (itemlocdist_qty + _qty)
    WHERE (itemlocdist_id=_itemlocdistid);

    RETURN _itemlocdistid;
  END IF;

--  Create a new itemlocdist
  SELECT NEXTVAL('itemlocdist_itemlocdist_id_seq') INTO _itemlocdistid;

  INSERT INTO itemlocdist
  ( itemlocdist_id, itemlocdist_itemlocdist_id,
    itemlocdist_source_type, itemlocdist_source_id,
    itemlocdist_qty, itemlocdist_expiration )
  VALUES
  ( _itemlocdistid, pItemlocdistid,
    'I', _itemlocid,
    _qty, endOfTime() );

  RETURN _itemlocdistid;

END;
$$ LANGUAGE 'plpgsql';
