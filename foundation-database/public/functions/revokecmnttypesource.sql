
CREATE OR REPLACE FUNCTION revokeCmnttypeSource(INTEGER, INTEGER) RETURNS BOOL AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCmnttypeid ALIAS FOR $1;
  pSourceid ALIAS FOR $2;

BEGIN

  DELETE FROM cmnttypesource
  WHERE ( (cmnttypesource_cmnttype_id=pCmnttypeid)
    AND (cmnttypesource_source_id=pSourceid) );

  RETURN TRUE;

END;
$$ LANGUAGE 'plpgsql';

