CREATE OR REPLACE FUNCTION setMetric(TEXT, TEXT) RETURNS BOOLEAN AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pMetricName ALIAS FOR $1;
  pMetricValue ALIAS FOR $2;
  _metricid INTEGER;

BEGIN

  SELECT metric_id INTO _metricid
  FROM metric
  WHERE (metric_name=pMetricName);

  IF (FOUND) THEN
    UPDATE metric
    SET metric_value=pMetricValue
    WHERE (metric_id=_metricid);

  ELSE
    INSERT INTO metric
    (metric_name, metric_value)
    VALUES (pMetricName, pMetricValue);
  END IF;

  RETURN TRUE;

END;
' LANGUAGE 'plpgsql';
