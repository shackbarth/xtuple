CREATE OR REPLACE FUNCTION valueAtShipping(plineitemid INTEGER) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  RETURN valueAtShipping('SO', plineitemid);
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION valueAtShipping(pordertype TEXT,
                                           plineitemid INTEGER) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _value NUMERIC := 0.0;

BEGIN

  IF (pordertype NOT IN ('SO', 'TO')) THEN
    RAISE EXCEPTION '% is not a valid order type', pordertype;
  END IF;

  SELECT COALESCE(SUM(shipitem_value), 0.0) INTO _value
  FROM shipitem JOIN shiphead ON (shipitem_shiphead_id=shiphead_id)
  WHERE ( (NOT shiphead_shipped)
    AND  (shiphead_order_type=pordertype)
    AND  (shipitem_orderitem_id=plineitemid) );

  RETURN _value;

END;
$$ LANGUAGE 'plpgsql';
