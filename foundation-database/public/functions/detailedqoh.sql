CREATE OR REPLACE FUNCTION detailedQOH(INTEGER, BOOLEAN) RETURNS NUMERIC AS '
-- Copyright (c) 1999-2012 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemsiteid ALIAS FOR $1;
  pABS ALIAS FOR $2;
  _qoh NUMERIC;

BEGIN

  IF (pABS) THEN
    SELECT SUM(noNeg(itemloc_qty)) INTO _qoh
    FROM itemloc LEFT OUTER JOIN location ON (itemloc_location_id=location_id)
    WHERE ( ( (location_id IS NULL) OR (location_netable) )
     AND (itemloc_itemsite_id=pItemsiteid) );
  ELSE
    SELECT SUM(itemloc_qty) INTO _qoh
    FROM itemloc LEFT OUTER JOIN location ON (itemloc_location_id=location_id)
    WHERE ( ( (location_id IS NULL) OR (location_netable) )
     AND (itemloc_itemsite_id=pItemsiteid) );
  END IF;

  IF (_qoh IS NULL) THEN
    _qoh := 0;
  END IF;

  RETURN _qoh;

END;
' LANGUAGE 'plpgsql';
