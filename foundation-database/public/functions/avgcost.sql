CREATE OR REPLACE FUNCTION avgCost(pItemsiteid INTEGER) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _value NUMERIC;
  _qoh NUMERIC;
BEGIN
  SELECT itemsite_value, itemsite_qtyonhand
    INTO _value, _qoh
    FROM itemsite
   WHERE(itemsite_id=pItemsiteid);
  IF (_qoh = 0.0) THEN
    RETURN 0.0;
  END IF;
  RETURN _value / _qoh;
END;
$$ LANGUAGE plpgsql;

