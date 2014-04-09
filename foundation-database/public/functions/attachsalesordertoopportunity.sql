CREATE OR REPLACE FUNCTION attachSalesOrderToOpportunity(INTEGER, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pSoheadid	ALIAS FOR $1;
  pOpheadid	ALIAS FOR $2;
BEGIN

-- Check Sales Order
  IF (NOT EXISTS(SELECT cohead_id
                 FROM cohead
                 WHERE (cohead_id=pSoheadid))) THEN
    RETURN -1;
  END IF;

-- Check Opportunity
  IF (NOT EXISTS(SELECT ophead_id
                 FROM ophead
                 WHERE (ophead_id=pOpheadid))) THEN
    RETURN -2;
  END IF;

-- Cannot attach if already attached
  IF (EXISTS(SELECT cohead_id
	     FROM cohead
	     WHERE ((cohead_id=pSoheadid)
	       AND  (cohead_ophead_id IS NOT NULL)))) THEN
    RETURN -3;
  END IF;

  UPDATE cohead SET cohead_ophead_id=pOpheadid
  WHERE (cohead_id=pSoheadid);

  RETURN 0;

END;
$$ LANGUAGE 'plpgsql';
