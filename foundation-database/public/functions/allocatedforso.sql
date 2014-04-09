CREATE OR REPLACE FUNCTION allocatedForSo(INTEGER, INTEGER) RETURNS NUMERIC STABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemsiteid ALIAS FOR $1;
  pDate ALIAS FOR $2;

BEGIN

  RETURN allocatedForSo(pItemsiteid, startOfTime(), (CURRENT_DATE + pDate));

END;
$$ LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION allocatedForSo(INTEGER, DATE) RETURNS NUMERIC STABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemsiteid ALIAS FOR $1;
  pDate ALIAS FOR $2;

BEGIN

  RETURN allocatedForSo(pItemsiteid, startOfTime(), pDate);

END;
$$ LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION allocatedForSo(INTEGER, DATE, DATE) RETURNS NUMERIC STABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemsiteid ALIAS FOR $1;
  pStartDate ALIAS FOR $2;
  pEndDate ALIAS FOR $3;
  _qty NUMERIC;

BEGIN

  SELECT COALESCE(SUM(noNeg(itemuomtouom(itemsite_item_id, coitem_qty_uom_id, NULL, coitem_qtyord - (coitem_qtyshipped + qtyAtShipping(coitem_id)) + coitem_qtyreturned))), 0.0) INTO _qty
  FROM coitem, itemsite, item
  WHERE ( (coitem_itemsite_id=itemsite_id)
    AND (itemsite_item_id=item_id)
    AND (coitem_status='O')
    AND (coitem_itemsite_id=pItemsiteid)
    AND (coitem_scheddate BETWEEN pStartDate AND pEndDate) );

  RETURN _qty;

END;
$$ LANGUAGE 'plpgsql';
