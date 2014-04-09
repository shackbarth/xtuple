
CREATE OR REPLACE FUNCTION firstLine(TEXT) RETURNS TEXT IMMUTABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pSource ALIAS FOR $1;
  _result TEXT := '';

BEGIN
  SELECT regexp_replace(pSource, E'^(\r?\n)*([^\r\n]*)\r?\n.*', E'\\2') INTO _result;
  RETURN _result;
END;
$$ LANGUAGE 'plpgsql';

