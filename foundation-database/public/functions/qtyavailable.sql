
CREATE OR REPLACE FUNCTION qtyAvailable(pItemsiteId INTEGER) RETURNS NUMERIC STABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _qty         NUMERIC = 0.0;

BEGIN
  _qty := qtyAvailable(pItemsiteId, TRUE);

  RETURN _qty;

END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION qtyAvailable(pItemsiteId INTEGER,
                                        pUsable BOOLEAN) RETURNS NUMERIC STABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _qty         NUMERIC = 0.0;

BEGIN
  IF (pUsable) THEN
    -- Summarize itemloc qty for this itemsite/usable locations
    -- or use itemsite_qtyonhand for regular/non-lot
    SELECT COALESCE(SUM(itemloc_qty), itemsite_qtyonhand) INTO _qty
      FROM itemsite LEFT OUTER JOIN itemloc ON (itemloc_itemsite_id=itemsite_id)
                    LEFT OUTER JOIN location ON (location_id=itemloc_location_id)
     WHERE (itemsite_id=pItemsiteId)
       AND ((location_id IS NULL) OR (COALESCE(location_usable, true)))
     GROUP BY itemsite_qtyonhand;
  ELSE
    -- Summarize itemloc qty for this itemsite/non-usable locations
    SELECT COALESCE(SUM(itemloc_qty), 0.0) INTO _qty
      FROM itemloc JOIN location ON (location_id=itemloc_location_id)
     WHERE (itemloc_itemsite_id=pItemsiteId)
       AND (NOT COALESCE(location_usable, true));
  END IF;

  RETURN _qty;

END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION qtyAvailable(pItemsiteid INTEGER,
                                        pLookAheadDays INTEGER) RETURNS NUMERIC STABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE

BEGIN

  RETURN ( ( SELECT qtyAvailable(itemsite_id)
             FROM itemsite
             WHERE (itemsite_id=pItemsiteid) ) +
           (SELECT qtyOrdered(pItemsiteid, pLookAheadDays)) -
           (SELECT qtyAllocated(pitemsiteid, pLookAheadDays)) );
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION qtyAvailable(pItemsiteid INTEGER,
                                        pDate DATE) RETURNS NUMERIC STABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE

BEGIN

  RETURN ( ( SELECT qtyAvailable(itemsite_id)
             FROM itemsite
             WHERE (itemsite_id=pItemsiteid) ) +
           (SELECT qtyOrdered(pItemsiteid, (pDate - CURRENT_DATE))) -
           (SELECT qtyAllocated(pItemsiteid, (pDate - CURRENT_DATE))) );
END;
$$ LANGUAGE plpgsql;

