
CREATE OR REPLACE FUNCTION currentARMemoNumber() RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _number INTEGER;

BEGIN

  SELECT orderseq_number INTO _number
  FROM orderseq
  WHERE (orderseq_name=''ARMemoNumber'');
  IF (NOT FOUND) THEN
    _number := 0;
  END IF;

  RETURN _number;

END;
' LANGUAGE 'plpgsql';

