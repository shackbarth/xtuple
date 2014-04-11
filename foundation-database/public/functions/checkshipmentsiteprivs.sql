CREATE OR REPLACE FUNCTION checkShipmentSitePrivs(INTEGER) RETURNS BOOLEAN AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pShipheadid ALIAS FOR $1;
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
    FROM ( SELECT coitem_id
             FROM shipitem, coitem, itemsite
            WHERE ( (shipitem_shiphead_id=pShipheadid)
              AND   (coitem_id=shipitem_orderitem_id)
              AND   (coitem_itemsite_id=itemsite_id)
              AND   (itemsite_warehous_id NOT IN (SELECT usrsite_warehous_id
                                                    FROM usrsite
                                                   WHERE (usrsite_username=getEffectiveXtUser()))) )
           UNION
           SELECT cohead_warehous_id
             FROM shipitem, coitem, cohead
            WHERE ( (shipitem_shiphead_id=pShipheadid)
              AND   (coitem_id=shipitem_orderitem_id)
              AND   (cohead_id=coitem_cohead_id)
              AND   (cohead_warehous_id NOT IN (SELECT usrsite_warehous_id
                                                  FROM usrsite
                                                 WHERE (usrsite_username=getEffectiveXtUser()))) )
         ) AS data;
  IF (_result > 0) THEN
    RETURN false;
  END IF;

  RETURN true;
END;
' LANGUAGE 'plpgsql';
