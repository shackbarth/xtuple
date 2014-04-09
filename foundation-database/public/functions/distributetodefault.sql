CREATE OR REPLACE FUNCTION distributeToDefault(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemlocdistid ALIAS FOR $1;

BEGIN

  RETURN distributeToDefault(pItemlocdistid, 'O');

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION distributeToDefault(INTEGER, TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemlocdistid ALIAS FOR $1;
  pTranstype ALIAS FOR $2;
  _locationid INTEGER;
  _itemlocdistid INTEGER;
  _qty NUMERIC;

BEGIN

--  Make sure that the itemsite in question has a default location
  SELECT CASE WHEN (pTranstype='R') THEN itemsite_recvlocation_id
              WHEN (pTranstype='I') THEN itemsite_issuelocation_id
              ELSE itemsite_location_id
         END INTO _locationid
  FROM itemlocdist, itemsite
  WHERE ( (itemlocdist_itemsite_id=itemsite_id)
   AND (itemlocdist_id=pItemlocdistid) );
  IF ( (NOT FOUND) OR (_locationid = -1) ) THEN
    RETURN -1;
  END IF;

--  Determine the remaining qty required to distribute
  SELECT (p.itemlocdist_qty - COALESCE(SUM(c.itemlocdist_qty), 0)) INTO _qty
  FROM itemlocdist AS p LEFT OUTER JOIN itemlocdist AS c ON (c.itemlocdist_itemlocdist_id=p.itemlocdist_id)
  WHERE (p.itemlocdist_id=pItemlocdistid)
  GROUP BY p.itemlocdist_qty;

  IF (_qty = 0) THEN
    RETURN -2;
  END IF;

--  Check to see if an itemlocdist with the correct location/lotserial/expiration already exists
  SELECT target.itemlocdist_id INTO _itemlocdistid
  FROM itemlocdist AS source, itemlocdist AS target, itemloc, itemsite
  WHERE ( (target.itemlocdist_source_type='L')
   AND (target.itemlocdist_source_id=_locationid)
   AND (target.itemlocdist_itemsite_id=source.itemlocdist_itemsite_id)
   AND (COALESCE(target.itemlocdist_ls_id)=COALESCE(source.itemlocdist_ls_id))
   AND (target.itemlocdist_expiration=source.itemlocdist_expiration)
   AND (target.itemlocdist_itemlocdist_id=source.itemlocdist_itemlocdist_id)
   AND (target.itemlocdist_itemsite_id=itemsite_id)
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
  ( itemlocdist_id, itemlocdist_itemlocdist_id, itemlocdist_source_type,
    itemlocdist_ls_id, itemlocdist_expiration,
    itemlocdist_source_id, itemlocdist_itemsite_id, itemlocdist_qty )
  SELECT _itemlocdistid, pItemlocdistid, 'L',
         itemlocdist_ls_id, itemlocdist_expiration,
         _locationid, itemlocdist_itemsite_id, _qty
  FROM itemlocdist
  WHERE (itemlocdist_id=pItemlocdistid);

  RETURN _itemlocdistid;

END;
$$ LANGUAGE 'plpgsql';
