
CREATE OR REPLACE FUNCTION formatShipmentNumber(INTEGER) RETURNS TEXT IMMUTABLE AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pshipheadid    ALIAS FOR $1;
BEGIN
  RETURN ( SELECT COALESCE(shiphead_number::TEXT, '''')
           FROM shiphead
           WHERE (shiphead_id=pshipheadid) );
END;
' LANGUAGE 'plpgsql';

