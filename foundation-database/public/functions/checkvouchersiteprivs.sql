CREATE OR REPLACE FUNCTION checkVoucherSitePrivs(INTEGER) RETURNS BOOLEAN STABLE AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pVoheadid ALIAS FOR $1;
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
    FROM ( SELECT voitem_id
             FROM voitem, poitem, itemsite
            WHERE ( (voitem_vohead_id=pVoheadid)
              AND   (poitem_id=voitem_poitem_id)
              AND   (poitem_itemsite_id=itemsite_id)
              AND   (itemsite_warehous_id NOT IN (SELECT usrsite_warehous_id
                                                    FROM usrsite
                                                   WHERE (usrsite_username=getEffectiveXtUser()))) )
           UNION
           SELECT pohead_warehous_id
             FROM vohead, pohead
            WHERE ( (vohead_id=pVoheadid)
              AND   (pohead_id=vohead_pohead_id)
              AND   (pohead_warehous_id NOT IN (SELECT usrsite_warehous_id
                                                  FROM usrsite
                                                 WHERE (usrsite_username=getEffectiveXtUser()))) )
         ) AS data;
  IF (_result > 0) THEN
    RETURN false;
  END IF;

  RETURN true;
END;
' LANGUAGE 'plpgsql';
