CREATE OR REPLACE FUNCTION returnCompleteShipment(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  RETURN returnCompleteShipment($1, 0, CURRENT_TIMESTAMP);
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION returnCompleteShipment(INTEGER, INTEGER, TIMESTAMP WITH TIME ZONE) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pshipheadid		ALIAS FOR $1;
  _itemlocSeries	INTEGER := $2;
  _timestamp		TIMESTAMP WITH TIME ZONE := $3;
  _r RECORD;
  _result 		RECORD;
  _shiphead_number	TEXT := '';
  _count		INTEGER := 0;
  _countsum		INTEGER := 0;

BEGIN
  FOR _r IN SELECT shipitem_id
            FROM shipitem, shiphead
            WHERE ( (shipitem_shiphead_id=shiphead_id)
             AND (NOT shiphead_shipped)
             AND (shiphead_id=pshipheadid) ) LOOP
    _itemlocSeries := returnShipmentTransaction(_r.shipitem_id, _itemlocSeries, _timestamp);
  END LOOP;

  FOR _result IN SELECT shiphead_number
                   FROM shiphead
                  WHERE ( (shiphead_id=pshipheadid) ) LOOP
    _shiphead_number := _result.shiphead_number;
  END LOOP;

  SELECT COUNT(*) INTO _count
    FROM shipdata
   WHERE(shipdata_shiphead_number=_shiphead_number);

  SELECT COUNT(*) INTO _countsum
    FROM shipdatasum
   WHERE(shipdatasum_shiphead_number=_shiphead_number);

  IF (_count > 0) THEN
    DELETE FROM shipdata
     WHERE(shipdata_shiphead_number=_shiphead_number);
  END IF;
  IF (_countsum > 0) THEN
    DELETE FROM shipdatasum
     WHERE(shipdatasum_shiphead_number=_shiphead_number);
  END IF;

  DELETE FROM pack
   WHERE(pack_shiphead_id=pshipheadid);
  DELETE FROM shiphead
  WHERE (shiphead_id=pshipheadid);

  RETURN _itemlocSeries;

END;
$$ LANGUAGE 'plpgsql';
