CREATE OR REPLACE FUNCTION revokeAllModuleCmnttypeSource(INTEGER, TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCmnttypeid ALIAS FOR $1;
  pModuleName ALIAS FOR $2;

BEGIN

  DELETE FROM cmnttypesource
  WHERE (cmnttypesource_id IN ( SELECT cmnttypesource_id
                                FROM cmnttypesource, source
                                WHERE ( (cmnttypesource_source_id=source_id)
                                  AND (cmnttypesource_cmnttype_id=pCmnttypeid)
                                  AND (source_module=pModuleName) ) ) );

  RETURN 1;

END;
$$ LANGUAGE 'plpgsql';

