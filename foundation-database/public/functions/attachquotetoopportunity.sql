CREATE OR REPLACE FUNCTION attachQuoteToOpportunity(INTEGER, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pQuheadid	ALIAS FOR $1;
  pOpheadid	ALIAS FOR $2;
BEGIN

-- Check Quote
  IF (NOT EXISTS(SELECT quhead_id
                 FROM quhead
                 WHERE (quhead_id=pQuheadid))) THEN
    RETURN -1;
  END IF;

-- Check Opportunity
  IF (NOT EXISTS(SELECT ophead_id
                 FROM ophead
                 WHERE (ophead_id=pOpheadid))) THEN
    RETURN -2;
  END IF;

-- Cannot attach if already attached
  IF (EXISTS(SELECT quhead_id
	     FROM quhead
	     WHERE ((quhead_id=pQuheadid)
	       AND  (quhead_ophead_id IS NOT NULL)))) THEN
    RETURN -3;
  END IF;

  UPDATE quhead SET quhead_ophead_id=pOpheadid
  WHERE (quhead_id=pQuheadid);

  RETURN 0;

END;
$$ LANGUAGE 'plpgsql';
