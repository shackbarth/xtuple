
CREATE OR REPLACE FUNCTION clearPayment(INTEGER) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pApselectid ALIAS FOR $1;

BEGIN

  DELETE FROM apselect
  WHERE (apselect_id=pApselectid);

  RETURN 1;

END;
' LANGUAGE 'plpgsql';

