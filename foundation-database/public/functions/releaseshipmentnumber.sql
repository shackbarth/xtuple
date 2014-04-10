CREATE OR REPLACE FUNCTION releaseShipmentNumber(INTEGER) RETURNS BOOLEAN AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pNumber ALIAS FOR $1;
  _test INTEGER;

BEGIN

--  Check to see if a Shipment exists with the passed number
  SELECT shiphead_id INTO _test
  FROM shiphead
  WHERE (shiphead_number=pNumber);

  IF (FOUND) THEN
    RETURN FALSE;
  END IF;

--  Check to see if ShipmentNumber orderseq has been incremented past the passed number
  SELECT orderseq_number INTO _test
  FROM orderseq
  WHERE (orderseq_name=''ShipmentNumber'');

  IF ((_test - 1) <> pNumber) THEN
    RETURN FALSE;
  END IF;

--  Decrement the orderseq, releasing the passed number
  UPDATE orderseq
  SET orderseq_number = (orderseq_number - 1)
  WHERE (orderseq_name=''ShipmentNumber'');

  RETURN TRUE;

END;
' LANGUAGE 'plpgsql';
