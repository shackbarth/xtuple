
CREATE OR REPLACE FUNCTION formatBooSeq(INTEGER, INTEGER) RETURNS TEXT AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemid ALIAS FOR $1;
  pBooitemSeqId ALIAS FOR $2;
  _result TEXT;
  
BEGIN

  IF (fetchMetricBool('Routings')) THEN
    SELECT booitem_seqnumber::text INTO _result
    FROM xtmfg.booitem(pItemid)
    WHERE (booitem_seq_id=pBooitemSeqId);

    RETURN _result;
  ELSE
    RETURN NULL;
  END IF;

END;
$$ LANGUAGE 'plpgsql';

