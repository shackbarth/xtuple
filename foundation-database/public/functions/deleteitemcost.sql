CREATE OR REPLACE FUNCTION deleteItemCost(INTEGER, INTEGER) RETURNS INTEGER AS $BODY$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemId ALIAS FOR $1;
  pCostElemId ALIAS FOR $2;
  _itemcost_id INTEGER;
  _postcost_return BOOLEAN;
  _std_cost NUMERIC;

BEGIN
  SELECT itemcost_id INTO _itemcost_id
  FROM itemcost
  WHERE ( (itemcost_item_id = pItemId) AND (itemcost_costelem_id = pCostElemId) );

  IF (NOT FOUND) THEN
	RAISE EXCEPTION 'itemcost % not found for. ', pItemId || ' & ' || pCostElemId;
  END IF;

  SELECT itemcost_stdcost INTO _std_cost
  FROM itemcost
  WHERE (itemcost_id = _itemcost_id);

  IF (_std_cost > 0) THEN
--Actual Cost is updated to zero to ensure inventory is valued correctly
    PERFORM updateCost(_itemcost_id, 0);
  END IF;

  DELETE FROM itemcost
  WHERE (itemcost_id=_itemcost_id);
 
  RETURN _itemcost_id;	

END;
$BODY$
  LANGUAGE 'plpgsql';
