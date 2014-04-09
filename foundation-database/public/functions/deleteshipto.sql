
CREATE OR REPLACE FUNCTION deleteShipto(INTEGER) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pShiptoid ALIAS FOR $1;

BEGIN

  PERFORM asohist_id
  FROM asohist
  WHERE (asohist_shipto_id=pShiptoid)
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -1;
  END IF;

  PERFORM cohead_id
  FROM cohead
  WHERE (cohead_shipto_id=pShiptoid)
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -2;
  END IF;

  PERFORM cmhead_id
  FROM cmhead
  WHERE (cmhead_shipto_id=pShiptoid)
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -3;
  END IF;

  PERFORM cohist_id
  FROM cohist
  WHERE (cohist_shipto_id=pShiptoid)
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -4;
  END IF;

  PERFORM quhead_id
  FROM quhead
  WHERE (quhead_shipto_id=pShiptoid)
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -5;
  END IF;

  PERFORM invchead_id
  FROM invchead
  WHERE (invchead_shipto_id=pShiptoid)
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -6;
  END IF;

  DELETE FROM ipsass
  WHERE (ipsass_shipto_id=pShiptoid);

  DELETE FROM shiptoinfo
  WHERE (shipto_id=pShiptoid);

  RETURN 0;

END;
' LANGUAGE 'plpgsql';

