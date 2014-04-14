CREATE OR REPLACE FUNCTION releaseNumber(TEXT, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  psequence	ALIAS FOR $1;
  pnumber 	ALIAS FOR $2;
BEGIN
  IF (fetchMetricBool('EnableGaplessNumbering')) THEN
    -- drop the number back into the pool if it was not committed
    PERFORM clearNumberIssue(psequence, pnumber);
  END IF;
  
  UPDATE orderseq SET
    orderseq_number = LEAST(pnumber, orderseq_number)
  WHERE (orderseq_name=psequence);

  RETURN 1;
END;
$$ LANGUAGE 'plpgsql';
