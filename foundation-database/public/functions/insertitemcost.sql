CREATE OR REPLACE FUNCTION insertItemCost(INTEGER, INTEGER, INTEGER, NUMERIC, BOOLEAN) RETURNS INTEGER AS $BODY$
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

--This function is used with the api.itemcost View for updating and inserting
--into the itemcosts table

BEGIN
  IF (pCost IS NULL OR pCost < 0) THEN
    RAISE EXCEPTION 'itemcost Actual Cost Invalid ', pCost;
  END IF;

-- Check for uniqueness
  SELECT itemcost_id INTO _itemcost_id
  FROM itemcost
  WHERE ( (itemcost_item_id = pItemId)
    AND   (itemcost_costelem_id = pCostElemId)
    AND   (NOT itemcost_lowlevel) );
  IF (FOUND) THEN
    RAISE EXCEPTION 'itemcost already exists for this Item and Cost Element';
  END IF;

-- Check for valid combination of item_type and costelem_type
  IF (SELECT (COUNT(*) > 0)
      FROM item, costelem
      WHERE (item_id=pItemId)
        AND (costelem_id=pCostElemId)
        AND (item_type IN ('M', 'F', 'B', 'C', 'T'))
        AND (costelem_type IN ('Material'))) THEN
    RAISE EXCEPTION 'itemcost of this type is invalid for Manufactured Item';
  END IF;
  
  IF (SELECT (COUNT(*) > 0)
      FROM item, costelem
      WHERE (item_id=pItemId)
        AND (costelem_id=pCostElemId)
        AND (item_type IN ('O', 'P'))
        AND (costelem_type IN ('Direct Labor', 'Overhead', 'Machine Overhead'))) THEN
    RAISE EXCEPTION 'itemcost of this type is invalid for Purchased Item';
  END IF;
  
  IF (pCost > 0) THEN
    SELECT NEXTVAL('itemcost_itemcost_id_seq') INTO _itemcost_id;
    INSERT INTO itemcost
      ( itemcost_id, itemcost_item_id, itemcost_costelem_id, itemcost_lowlevel,
        itemcost_stdcost, itemcost_posted, itemcost_actcost, itemcost_updated, itemcost_curr_id )
    VALUES
      ( _itemcost_id, pItemId, pCostElemId, FALSE,
        0, startOfTime(), pCost, CURRENT_DATE, pCurrId );

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
