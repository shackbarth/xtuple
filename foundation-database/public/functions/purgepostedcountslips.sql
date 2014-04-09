CREATE OR REPLACE FUNCTION purgePostedCountSlips(DATE, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCutoffDate ALIAS FOR $1;
  pWarehousid ALIAS FOR $2;

BEGIN

  IF (pWarehousid = -1) THEN
    DELETE FROM cntslip
    WHERE (cntslip_id IN ( SELECT cntslip_id
                           FROM cntslip, invcnt
                           WHERE ( (cntslip_cnttag_id=invcnt_id)
                            AND (invcnt_posted)
                            AND (cntslip_posted)
                            AND (date(invcnt_postdate) <= pCutoffDate) ) ) );

  ELSE
    DELETE FROM cntslip
    WHERE (cntslip_id IN ( SELECT cntslip_id
                           FROM invcnt, itemsite
                           WHERE ( (cntslip_cnttag_id=invcnt_id)
                            AND (invcnt_posted)
                            AND (cntslip_posted)
                            AND (invcnt_itemsite_id=itemsite_id)
                            AND (date(invcnt_postdate) <= pCutoffDate)
                            AND (itemsite_warehous_id=pWarehousid) ) ) );
  END IF;

  RETURN 1;

END;
$$ LANGUAGE 'plpgsql';
