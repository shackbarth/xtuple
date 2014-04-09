CREATE OR REPLACE FUNCTION stdCost(INTEGER) RETURNS NUMERIC STABLE AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  RETURN stdCost($1, NULL);
END;
' LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION stdCost(INTEGER, INTEGER) RETURNS NUMERIC STABLE AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemid ALIAS FOR $1;
  pBomitemid ALIAS FOR $2;
  _cost NUMERIC;

BEGIN

  SELECT SUM(COALESCE(bomitemcost_stdcost, itemcost_stdcost)) INTO _cost
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
