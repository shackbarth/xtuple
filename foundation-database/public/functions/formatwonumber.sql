
CREATE OR REPLACE FUNCTION formatWoNumber(integer) RETURNS TEXT IMMUTABLE AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pWoid ALIAS FOR $1;

BEGIN

  RETURN ( SELECT (wo_number::TEXT || ''-'' || wo_subnumber::TEXT)
           FROM wo
           WHERE (wo_id=pWoid) );

END;
' LANGUAGE 'plpgsql';

