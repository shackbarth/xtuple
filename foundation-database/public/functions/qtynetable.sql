
CREATE OR REPLACE FUNCTION qtyNetable(pItemsiteId INTEGER) RETURNS NUMERIC STABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _qty         NUMERIC = 0.0;

BEGIN
  _qty := qtyNetable(pItemsiteId, TRUE);

  RETURN _qty;

END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION qtyNetable(pItemsiteId INTEGER,
                                      pNetable BOOLEAN) RETURNS NUMERIC STABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _qty         NUMERIC = 0.0;

BEGIN
  IF (pNetable) THEN
    -- Summarize itemloc qty for this itemsite/netable locations
    -- or use itemsite_qtyonhand for regular/non-lot
    SELECT COALESCE(SUM(itemloc_qty), itemsite_qtyonhand) INTO _qty
      FROM itemsite LEFT OUTER JOIN itemloc ON (itemloc_itemsite_id=itemsite_id)
                    LEFT OUTER JOIN location ON (location_id=itemloc_location_id)
     WHERE (itemsite_id=pItemsiteId)
       AND ((location_id IS NULL) OR (COALESCE(location_netable, true)))
     GROUP BY itemsite_qtyonhand;
  ELSE
    -- Summarize itemloc qty for this itemsite/non-netable locations
    SELECT COALESCE(SUM(itemloc_qty), 0.0) INTO _qty
      FROM itemloc JOIN location ON (location_id=itemloc_location_id)
     WHERE (itemloc_itemsite_id=pItemsiteId)
       AND (NOT COALESCE(location_netable, true));
  END IF;

  RETURN _qty;

END;
$$ LANGUAGE plpgsql;
