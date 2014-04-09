CREATE OR REPLACE FUNCTION actCost(INTEGER) RETURNS NUMERIC AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  RETURN actCost($1, NULL, baseCurrId());
END;
' LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION actCost(INTEGER, INTEGER) RETURNS NUMERIC AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  RETURN actCost($1, $2, baseCurrId());
END;
' LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION actCost(INTEGER, INTEGER, INTEGER) RETURNS NUMERIC AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemid ALIAS FOR $1;
  pBomitemid ALIAS FOR $2;
  pCurrid ALIAS FOR $3;
  _cost NUMERIC;

BEGIN

  -- Return actual cost in the given currency at the current conversion rate
  SELECT SUM(CASE WHEN (bomitemcost_id IS NOT NULL) THEN
                  ROUND(currToCurr(bomitemcost_curr_id, pCurrid, bomitemcost_actcost, CURRENT_DATE), 6)
                  ELSE
                  ROUND(currToCurr(itemcost_curr_id, pCurrid, itemcost_actcost, CURRENT_DATE), 6)
             END) INTO _cost
  FROM itemcost
    LEFT OUTER JOIN bomitemcost ON (bomitemcost_bomitem_id=pBomitemid AND bomitemcost_costelem_id=itemcost_costelem_id)
  WHERE (itemcost_item_id=pItemid);

  IF (_cost IS NULL) THEN
    RETURN 0;
  ELSE
    RETURN _cost;
  END IF;

END;
' LANGUAGE 'plpgsql';
