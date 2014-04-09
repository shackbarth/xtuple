CREATE OR REPLACE FUNCTION fetchjournalnumber(TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pUse ALIAS FOR $1;
  _number INTEGER;

BEGIN

  SELECT nextval('journal_number_seq') INTO _number;

  INSERT INTO jrnluse
  (jrnluse_date, jrnluse_number, jrnluse_use)
  VALUES
  (CURRENT_TIMESTAMP, _number, pUse);

  RETURN _number;
  
END;
$$ LANGUAGE 'plpgsql';

