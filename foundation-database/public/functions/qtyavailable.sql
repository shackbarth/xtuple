CREATE OR REPLACE FUNCTION qtyAvailable(INTEGER, INTEGER) RETURNS NUMERIC AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemsiteid ALIAS FOR $1;
  pLookAheadDays ALIAS FOR $2;

BEGIN

  RETURN ( ( SELECT qtyNetable(itemsite_id)
             FROM itemsite
             WHERE (itemsite_id=pItemsiteid) ) +
           (SELECT qtyOrdered(pItemsiteid, pLookAheadDays)) -
           (SELECT qtyAllocated(pitemsiteid, pLookAheadDays)) );
END;
' LANGUAGE 'plpgsql' STABLE;


CREATE OR REPLACE FUNCTION qtyAvailable(INTEGER, DATE) RETURNS NUMERIC AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemsiteid ALIAS FOR $1;
  pDate ALIAS FOR $2;

BEGIN

  RETURN ( ( SELECT qtyNetable(itemsite_id)
             FROM itemsite
             WHERE (itemsite_id=pItemsiteid) ) +
           (SELECT qtyOrdered(pItemsiteid, (pDate - CURRENT_DATE))) -
           (SELECT qtyAllocated(pItemsiteid, (pDate - CURRENT_DATE))) );
END;
' LANGUAGE 'plpgsql' STABLE;

