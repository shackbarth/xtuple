
CREATE OR REPLACE FUNCTION calcWooperStartStub(INTEGER, INTEGER) RETURNS DATE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pWoId         ALIAS FOR $1;
  pBooitemSeqId ALIAS FOR $2;
  _result       DATE;
BEGIN

  IF ( SELECT ((metric_value='t') AND packageIsEnabled('xtmfg'))
         FROM metric
        WHERE(metric_name='Routings') ) THEN
    RETURN xtmfg.calcWooperStart(pWoId, pBooitemSeqId);
  END IF;
  RETURN null;
END;
$$ LANGUAGE 'plpgsql';

