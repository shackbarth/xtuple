
CREATE OR REPLACE FUNCTION toggleBomitemCost(INTEGER, BOOLEAN) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pBomitemid ALIAS FOR $1;
  pEnabled   ALIAS FOR $2;

BEGIN

  IF (pEnabled) THEN
    INSERT INTO bomitemcost
    (bomitemcost_bomitem_id, bomitemcost_costelem_id,
     bomitemcost_lowlevel, bomitemcost_stdcost,
     bomitemcost_posted, bomitemcost_actcost,
     bomitemcost_updated, bomitemcost_curr_id)
    SELECT
     bomitem_id, itemcost_costelem_id,
     itemcost_lowlevel, itemcost_stdcost,
     itemcost_posted, itemcost_actcost,
     itemcost_updated, itemcost_curr_id
    FROM bomitem JOIN itemcost ON (itemcost_item_id=bomitem_item_id)
    WHERE (bomitem_id=pBomitemid);
  ELSE
    DELETE FROM bomitemcost
    WHERE (bomitemcost_bomitem_id=pBomitemid);
  END IF;

  RETURN 0;
END;
$$ LANGUAGE 'plpgsql';

