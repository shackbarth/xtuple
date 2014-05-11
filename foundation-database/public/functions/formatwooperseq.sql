CREATE OR REPLACE FUNCTION formatwooperseq(INTEGER) RETURNS TEXT AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pWooperId  ALIAS FOR $1;
  _result    TEXT;

BEGIN

  IF pWooperId = -1 THEN
    RETURN '';
  ELSE
    SELECT wooper_seqnumber INTO _result
    FROM xtmfg.wooper
    WHERE (wooper_id=pWooperId);
  END IF;

  RETURN _result;
END;
$$ LANGUAGE 'plpgsql';
