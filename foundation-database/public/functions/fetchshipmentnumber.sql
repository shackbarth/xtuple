CREATE OR REPLACE FUNCTION fetchshipmentnumber() RETURNS TEXT AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _number		TEXT;
  _test			INTEGER;

BEGIN
  LOOP

    SELECT CAST(nextval('shipment_number_seq') AS TEXT) INTO _number;
    
    SELECT shiphead_id INTO _test
      FROM shiphead
     WHERE (shiphead_number=_number);
    IF (NOT FOUND) THEN
      EXIT;
    END IF;

  END LOOP;

  RETURN _number;
  
END;
$$ LANGUAGE 'plpgsql';

