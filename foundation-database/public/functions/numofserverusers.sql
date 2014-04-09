
CREATE OR REPLACE FUNCTION numOfServerUsers() RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _count INTEGER;

BEGIN

  SELECT COUNT(*) INTO _count
  FROM pg_stat_activity;
  IF (_count IS NULL) THEN
    _count := 0;
  END IF;

  RETURN _count;

END;
' LANGUAGE 'plpgsql';

