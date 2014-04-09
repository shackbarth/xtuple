CREATE OR REPLACE FUNCTION checkCreditMemoSitePrivs(INTEGER) RETURNS BOOLEAN AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCmheadid ALIAS FOR $1;
  _check    BOOLEAN;
  _result   INTEGER;

BEGIN

  IF (NOT fetchMetricBool(''MultiWhs'')) THEN
    RETURN true;
  END IF;

  IF (NOT fetchUsrPrefBool(''selectedSites'')) THEN
    RETURN true;
  END IF;

  SELECT COALESCE(COUNT(*), 0) INTO _result
    FROM ( SELECT cmitem_id
             FROM cmitem JOIN itemsite ON (itemsite_id=cmitem_itemsite_id)
            WHERE ( (cmitem_cmhead_id=pCmheadid)
              AND   (itemsite_warehous_id NOT IN (SELECT usrsite_warehous_id
                                                    FROM usrsite
                                                   WHERE (usrsite_username=getEffectiveXtUser()))) )
         ) AS data;
  IF (_result > 0) THEN
    RETURN false;
  END IF;

  RETURN true;
END;
' LANGUAGE 'plpgsql';
