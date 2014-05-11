CREATE OR REPLACE FUNCTION purgeShipments(DATE) RETURNS INTEGER  AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pcutoff ALIAS FOR $1;
  _r RECORD;

BEGIN

  -- Used for transfer orders shipments (which are never invoiced)
  FOR _r IN SELECT shiphead_id
	      FROM shiphead
	     WHERE ( (shiphead_order_type='TO')
               AND   (shiphead_shipped)
               AND   (shiphead_shipdate <= pcutoff) ) LOOP
    DELETE FROM shipitem WHERE (shipitem_shiphead_id=_r.shiphead_id);
    DELETE FROM shiphead WHERE (shiphead_id=_r.shiphead_id);
  END LOOP;

  RETURN 0;

END;
$$ LANGUAGE 'plpgsql';
