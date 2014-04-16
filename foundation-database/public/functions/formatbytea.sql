CREATE OR REPLACE FUNCTION formatbytea(bytea)
  RETURNS text AS
'
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pField ALIAS FOR $1;
  output_field TEXT;

BEGIN

  output_field := pField;

  RETURN output_field;

END;
'
  LANGUAGE 'plpgsql';
