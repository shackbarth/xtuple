CREATE OR REPLACE FUNCTION checkQuoteSitePrivs(INTEGER) RETURNS BOOLEAN STABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pQuheadid ALIAS FOR $1;

BEGIN

  RETURN checkQuoteSitePrivs(pQuheadid, NULL);

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION checkQuoteSitePrivs(INTEGER, INTEGER) RETURNS BOOLEAN STABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pQuheadid ALIAS FOR $1;
  pWarehousid ALIAS FOR $2;
  _result   INTEGER := 0;

BEGIN

--  RAISE NOTICE 'checkQuoteSitePrivs, pQuheadid = %', pQuheadid;
--  RAISE NOTICE 'checkQuoteSitePrivs, pWarehousid = %', pWarehousid;

  IF (NOT fetchMetricBool('MultiWhs')) THEN
    RETURN true;
  END IF;

  IF ( (NOT fetchUsrPrefBool('selectedSites')) AND (pWarehousid IS NULL) ) THEN
    RETURN true;
  END IF;

  IF (pWarehousid IS NULL) THEN
    SELECT COALESCE(COUNT(*), 0) INTO _result
    FROM quitem JOIN itemsite ON (itemsite_id=quitem_itemsite_id)
                JOIN site() ON (warehous_id=itemsite_warehous_id)
    WHERE (quitem_quhead_id=pQuheadid);
  ELSE
    SELECT COALESCE(COUNT(*), 0) INTO _result
    FROM quitem JOIN itemsite ON (itemsite_id=quitem_itemsite_id)
                JOIN site() ON (warehous_id=itemsite_warehous_id)
    WHERE ( (quitem_quhead_id=pQuheadid)
      AND   (itemsite_warehous_id=pWarehousid) );
  END IF;

  IF (_result > 0) THEN
    RETURN true;
  END IF;

  RETURN false;

END;
$$ LANGUAGE 'plpgsql';
