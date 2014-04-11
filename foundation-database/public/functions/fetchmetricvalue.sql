CREATE OR REPLACE FUNCTION FetchMetricValue(text) RETURNS NUMERIC STABLE AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _pMetricName ALIAS FOR $1;
  _returnVal INTEGER;
BEGIN
  SELECT CASE WHEN (isNumeric(metric_value)) THEN metric_value::INTEGER
              ELSE NULL
         END INTO _returnVal
    FROM metric
   WHERE metric_name = _pMetricName;
  RETURN _returnVal;
END;
' LANGUAGE 'plpgsql';
