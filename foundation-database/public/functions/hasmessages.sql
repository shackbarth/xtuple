
CREATE OR REPLACE FUNCTION hasMessages() RETURNS BOOLEAN AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN

  PERFORM msguser_id
  FROM msg, msguser
  WHERE ( (msguser_username=getEffectiveXtUser())
   AND (msguser_msg_id=msg_id)
   AND (CURRENT_TIMESTAMP BETWEEN msg_scheduled AND msg_expires)
   AND (msguser_viewed IS NULL) )
  LIMIT 1;
  RETURN FOUND;

END;
' LANGUAGE 'plpgsql';

