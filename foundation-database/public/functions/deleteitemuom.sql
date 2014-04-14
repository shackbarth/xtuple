CREATE OR REPLACE FUNCTION deleteItemUOM(INTEGER) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemuomid ALIAS FOR $1;

BEGIN
  DELETE FROM itemuom WHERE itemuom_id=pItemuomid;

  RETURN 0;
END;
' LANGUAGE 'plpgsql';
