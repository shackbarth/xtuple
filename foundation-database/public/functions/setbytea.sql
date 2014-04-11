CREATE OR REPLACE FUNCTION setbytea(text)
  RETURNS bytea AS
'
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pMetricName ALIAS FOR $1;
  _value bytea;

BEGIN

  _value := decode(pMetricName, ''escape'');

  RETURN _value;

END;
'
  LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION setbytea(bytea)
  RETURNS bytea AS
'
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pMetricName ALIAS FOR $1;
  _value bytea;

BEGIN

  _value := pMetricName;

  RETURN _value;

END;
'
  LANGUAGE 'plpgsql';
