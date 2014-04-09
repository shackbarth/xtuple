CREATE OR REPLACE FUNCTION updateLowlevel(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE

  pLowlevel ALIAS FOR $1;
  _num_back INTEGER;

BEGIN

  UPDATE costUpdate SET costUpdate_lowlevel_code = (pLowlevel + 1)
    WHERE costUpdate_item_id IN (
	  SELECT bomitem_item_id
	  FROM bomitem JOIN costUpdate ON (bomitem_parent_item_id = costUpdate_item_id)
	  WHERE ((costUpdate_lowlevel_code = pLowlevel)
            AND  (bomitem_rev_id=getActiveRevId('BOM',bomitem_parent_item_id))
	    AND  (CURRENT_DATE BETWEEN bomitem_effective
                                               AND (bomitem_expires - 1))))
      AND costUpdate_lowlevel_code >= pLowlevel;

  GET DIAGNOSTICS _num_back = ROW_COUNT;

  RETURN _num_back;

END;
$$ LANGUAGE 'plpgsql';

