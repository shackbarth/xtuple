CREATE OR REPLACE FUNCTION deleteClassCode(INTEGER) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pClasscodeid ALIAS FOR $1;
  _check INTEGER;

BEGIN

--  Check to see if any items are assigned to the passed classcode
  SELECT item_id INTO _check
  FROM item
  WHERE (item_classcode_id=pClasscodeid)
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -1;
  END IF;

--  Delete the passed classcode
  DELETE FROM classcode
  WHERE (classcode_id=pClasscodeid);

  RETURN pClasscodeid;

END;
' LANGUAGE 'plpgsql';
