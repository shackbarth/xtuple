CREATE OR REPLACE FUNCTION deleteUOMConv(INTEGER) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pUomconvid ALIAS FOR $1;

BEGIN
  DELETE FROM uomconv WHERE uomconv_id=pUomconvid;

  RETURN 0;
END;
' LANGUAGE 'plpgsql';
