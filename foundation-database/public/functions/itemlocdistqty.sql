CREATE OR REPLACE FUNCTION itemlocdistQty(TEXT, INTEGER, INTEGER) RETURNS NUMERIC AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pTypes ALIAS FOR $1;
  pLocationid ALIAS FOR $2;
  pParentid ALIAS FOR $3;
  _qty NUMERIC := 0;
  _tempQty NUMERIC;

BEGIN

  IF (strpos(pTypes, ''L'') > 0) THEN
    SELECT COALESCE(SUM(itemlocdist_qty), 0) INTO _tempQty
    FROM itemlocdist
    WHERE ( (itemlocdist_source_type=''L'')
     AND (itemlocdist_source_id=pLocationid)
     AND (itemlocdist_itemlocdist_id=pParentid) );

    _qty := (_qty + _tempQty);
  END IF;

  IF (strpos(pTypes, ''I'') > 0) THEN
    SELECT COALESCE(SUM(itemlocdist_qty), 0) INTO _tempQty
    FROM itemlocdist, itemloc
    WHERE ( (itemlocdist_source_type=''I'')
     AND (itemlocdist_source_id=itemloc_id)
     AND (itemloc_location_id=pLocationid)
     AND (itemlocdist_itemlocdist_id=pParentid) );

    _qty := (_qty + _tempQty);
  END IF;

  RETURN _qty;

END;
' LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION itemlocdistQty(INTEGER, INTEGER) RETURNS NUMERIC AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pLocationid ALIAS FOR $1;
  pParentid ALIAS FOR $2;
  _qty NUMERIC;
  _tempQty NUMERIC;

BEGIN

  SELECT COALESCE(SUM(itemlocdist_qty), 0) INTO _qty
  FROM itemlocdist
  WHERE ( (itemlocdist_source_type=''L'')
   AND (itemlocdist_source_id=pLocationid)
   AND (itemlocdist_itemlocdist_id=pParentid) );

  SELECT COALESCE(SUM(itemlocdist_qty), 0) INTO _tempQty
  FROM itemlocdist, itemloc
  WHERE ( (itemlocdist_source_type=''I'')
   AND (itemlocdist_source_id=itemloc_id)
   AND (itemloc_location_id=pLocationid)
   AND (itemlocdist_itemlocdist_id=pParentid) );

  _qty := (_qty + _tempQty);

  RETURN _qty;

END;
' LANGUAGE 'plpgsql';
