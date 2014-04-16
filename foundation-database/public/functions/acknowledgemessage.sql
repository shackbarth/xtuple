
CREATE OR REPLACE FUNCTION acknowledgeMessage(INTEGER) RETURNS BOOLEAN AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pMsgid ALIAS FOR $1;

BEGIN

  UPDATE msguser
  SET msguser_viewed=CURRENT_TIMESTAMP
  WHERE ( (msguser_msg_id=pMsgid)
   AND (msguser_username=getEffectiveXtUser()) );

  RETURN TRUE;

END;
' LANGUAGE 'plpgsql';

