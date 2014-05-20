CREATE OR REPLACE FUNCTION avgCost(pItemsiteid INTEGER) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _value NUMERIC;
  _qoh NUMERIC;
  _qohnn NUMERIC;
BEGIN
  SELECT itemsite_value, itemsite_qtyonhand, itemsite_nnqoh
    INTO _value, _qoh, _qohnn
    FROM itemsite
   WHERE(itemsite_id=pItemsiteid);
  IF (_qoh = 0.0 AND _qohnn = 0.0) THEN
    RETURN 0.0;
  END IF;
  RETURN _value / (_qoh + _qohnn);
END;
$$ LANGUAGE 'plpgsql';

