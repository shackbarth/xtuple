
CREATE OR REPLACE FUNCTION qtyAtLocation(pItemsiteid INTEGER,
                                         pLocationid INTEGER) RETURNS NUMERIC STABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _qty         NUMERIC := 0.0;

BEGIN
  SELECT CASE WHEN (pLocationid IS NULL) THEN itemsite_qtyonhand
              ELSE COALESCE(SUM(itemloc_qty), 0.0)
         END INTO _qty
    FROM itemsite LEFT OUTER JOIN itemloc ON (itemloc_itemsite_id=itemsite_id)
   WHERE ((itemsite_id=pItemsiteid)
     AND  (itemloc_location_id=pLocationid))
  GROUP BY itemsite_qtyonhand;

  RETURN _qty;

END;
$$ LANGUAGE plpgsql;
