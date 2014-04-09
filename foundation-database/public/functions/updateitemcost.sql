CREATE OR REPLACE FUNCTION UpdateItemCost(INTEGER, INTEGER, INTEGER, NUMERIC, BOOLEAN) RETURNS INTEGER AS $BODY$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
pItemId ALIAS FOR $1;
pCostElemId ALIAS FOR $2;
pCurrId ALIAS FOR $3;
pCost ALIAS FOR $4;
pPostToStandard ALIAS FOR $5;
_itemcost_id INTEGER;
_update_return INTEGER;
_postcost_return BOOLEAN;

--This function is used with the api.itemcost View for updating
--the itemcost table

BEGIN
  SELECT itemcost_id INTO _itemcost_id
  FROM itemcost
  WHERE ( (itemcost_item_id = pItemId) AND (itemcost_costelem_id = pCostElemId) );

  IF (NOT FOUND) THEN
    RAISE EXCEPTION 'itemcost % not found for. ', pItemId || ' & ' || pCostElemId;
  END IF;

  IF (pCost IS NULL OR pCost < 0) THEN
    RAISE EXCEPTION 'itemcost Actual Cost Invalid ', pCost;
  END IF;
  
  IF (pCost > 0) THEN
    UPDATE itemcost
    SET itemcost_actcost=pCost,
        itemcost_curr_id = pCurrId
    WHERE (itemcost_id=_itemcost_id);

    --Only Post Cost to standard if the parameter is set to true
    IF (pPostToStandard) THEN
      IF (NOT checkPrivilege('PostStandardCosts')) THEN
        RAISE EXCEPTION 'You do not have privileges to poststandard itemcosts. Set api.itemcost post_to_standard to false';
      END IF;
      SELECT postcost(_itemcost_id) INTO _postcost_return;       
      IF (NOT _postcost_return) THEN
        RETURN -2;
      END IF;
    END IF;
  ELSE 
    RETURN -1;
  END IF;

  RETURN _itemcost_id;
  
END;
$BODY$
  LANGUAGE 'plpgsql';
