
CREATE OR REPLACE FUNCTION qtyAtLocation(pItemsiteid INTEGER,
                                         pLocationid INTEGER) RETURNS NUMERIC STABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _qty         NUMERIC := 0.0;

BEGIN
  IF (pLocationid IS NULL) THEN
    SELECT COALESCE(itemsite_qtyonhand, 0.0) INTO _qty
    FROM itemsite
    WHERE (itemsite_id=pItemsiteid);
  ELSE
    SELECT COALESCE(SUM(itemloc_qty), 0.0) INTO _qty
      FROM itemsite LEFT OUTER JOIN itemloc ON (itemloc_itemsite_id=itemsite_id)
     WHERE ((itemsite_id=pItemsiteid)
       AND  (itemloc_location_id=pLocationid));
  END IF;

  RETURN _qty;

END;
$$ LANGUAGE plpgsql;
