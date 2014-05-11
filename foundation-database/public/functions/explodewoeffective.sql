CREATE OR REPLACE FUNCTION explodeWoEffective() RETURNS TEXT AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _value TEXT;

BEGIN

  SELECT metric_value INTO _value
  FROM metric
  WHERE (metric_name=''ExplodeWOEffective'');

  RETURN _value;

END;
' LANGUAGE 'plpgsql';
