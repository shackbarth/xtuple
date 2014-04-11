
CREATE OR REPLACE FUNCTION hasEvents() RETURNS BOOLEAN AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN

  PERFORM evntlog_id
  FROM evntlog
  WHERE ( (evntlog_dispatched IS NULL)
   AND (evntlog_username=getEffectiveXtUser()) )
  LIMIT 1;
  RETURN FOUND;

END;
' LANGUAGE 'plpgsql';

