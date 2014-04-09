CREATE OR REPLACE FUNCTION postCost(INTEGER) RETURNS BOOLEAN AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemcostid ALIAS FOR $1;
  _p RECORD;

BEGIN

  SELECT round(currToBase(itemcost_curr_id, itemcost_actcost, CURRENT_DATE),6) AS newcost,
         itemcost_curr_id, CURRENT_DATE AS effective,
         item_number,
         itemcost_stdcost AS oldcost INTO _p
  FROM itemcost, item
  WHERE ((itemcost_item_id=item_id)
    AND  (itemcost_id=pItemcostid));

  IF (_p.newcost IS NULL) THEN
      RAISE EXCEPTION ''There is no valid Exchange Rate for this currency. (%, %)'',
                  _p.itemcost_curr_id, _p.effective;
      RETURN FALSE;
  END IF;

  RETURN updateStdCost(pItemcostid, _p.newcost, _p.oldcost, ''Post Cost'',
               (''Post Actual Cost to Standard for item '' || _p.item_number));

END;
' LANGUAGE 'plpgsql';
