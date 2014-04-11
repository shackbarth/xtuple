CREATE OR REPLACE FUNCTION deleteUOM(INTEGER) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pUomid ALIAS FOR $1;

BEGIN

  DELETE FROM uomconv WHERE uomconv_from_uom_id=pUomid;
  DELETE FROM uomconv WHERE uomconv_to_uom_id=pUomid;
  DELETE FROM uom WHERE uom_id=pUomid;

  RETURN 0;
END;
' LANGUAGE 'plpgsql';
