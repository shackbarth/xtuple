
CREATE OR REPLACE FUNCTION formatPloNumber(INTEGER) RETURNS TEXT IMMUTABLE AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pPlanordid ALIAS FOR $1;
  _result TEXT;

BEGIN

  SELECT (TEXT(planord_number) || ''-'' || TEXT(planord_subnumber)) INTO _result
  FROM planord
  WHERE (planord_id=pPlanordid);

  RETURN _result;

END;
' LANGUAGE 'plpgsql';

