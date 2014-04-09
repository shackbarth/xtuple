
CREATE OR REPLACE FUNCTION getUnassignedAccntId() RETURNS INTEGER STABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _test INTEGER;
  _returnVal INTEGER;
BEGIN
  SELECT fetchMetricValue('UnassignedAccount') INTO _test;

  IF (_test IS NULL) THEN
    RAISE EXCEPTION 'Metric not found for UnassignedAccount';
  END IF;

  SELECT accnt_id INTO _returnVal
  FROM accnt
  WHERE (accnt_id=_test);

  IF (NOT FOUND) THEN
    RAISE EXCEPTION 'Metric UnassignedAccount is an invalid G/L Account';
  END IF;

  RETURN _returnVal;
END;
$$ LANGUAGE 'plpgsql';

