
CREATE OR REPLACE FUNCTION formatGLAccountLong(INTEGER) RETURNS TEXT IMMUTABLE AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pAccntid ALIAS FOR $1;
  _result TEXT;

BEGIN

  SELECT (formatGLAccount(accnt_id) || ''-'' || accnt_descrip) INTO _result
  FROM accnt
  WHERE (accnt_id=pAccntid);

  RETURN _result;

END;
' LANGUAGE 'plpgsql';

