CREATE OR REPLACE FUNCTION deleteFreightClass(INTEGER) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pFreightClassid ALIAS FOR $1;
  _check INTEGER;

BEGIN

--  Check to see if any items are assigned to the passed freightclass
  SELECT item_id INTO _check
  FROM item
  WHERE (item_freightclass_id=pFreightClassid)
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -1;
  END IF;

--  Delete the passed freightclass
  DELETE FROM freightclass
  WHERE (freightclass_id=pFreightClassid);

  RETURN pFreightClassid;

END;
' LANGUAGE 'plpgsql';
