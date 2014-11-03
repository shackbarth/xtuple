CREATE OR REPLACE FUNCTION detailedQOH(pItemsiteid INTEGER,
                                       pABS BOOLEAN) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _qoh NUMERIC;

BEGIN

  IF (pABS) THEN
    SELECT SUM(noNeg(itemloc_qty)) INTO _qoh
    FROM itemloc
    WHERE (itemloc_itemsite_id=pItemsiteid);
  ELSE
    SELECT SUM(itemloc_qty) INTO _qoh
    FROM itemloc
    WHERE (itemloc_itemsite_id=pItemsiteid);
  END IF;

  IF (_qoh IS NULL) THEN
    _qoh := 0.0;
  END IF;

  RETURN _qoh;

END;
$$ LANGUAGE plpgsql;
