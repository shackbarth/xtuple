CREATE OR REPLACE FUNCTION orderedByPo(INTEGER, INTEGER) RETURNS NUMERIC AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemsiteid ALIAS FOR $1;
  pLookAhead ALIAS FOR $2;
  _qty NUMERIC;

BEGIN

  SELECT orderedByPo(pItemsiteid, startOfTime(), (CURRENT_DATE + pLookAhead)) INTO _qty;
  RETURN _qty;

END;
' LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION orderedByPo(INTEGER, DATE, DATE) RETURNS NUMERIC AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemsiteid ALIAS FOR $1;
  pStartDate ALIAS FOR $2;
  pEndDate ALIAS FOR $3;
  _qty NUMERIC;

BEGIN

  SELECT COALESCE(SUM(noNeg(poitem_qty_ordered - poitem_qty_received) * poitem_invvenduomratio), 0.0) INTO _qty
  FROM poitem
  WHERE ( (poitem_itemsite_id=pItemsiteid)
    AND (poitem_status <> ''C'')
    AND (poitem_duedate BETWEEN pStartDate AND pEndDate) );

  RETURN _qty;

END;
' LANGUAGE 'plpgsql';
