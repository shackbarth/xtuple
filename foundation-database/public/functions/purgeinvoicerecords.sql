CREATE OR REPLACE FUNCTION purgeInvoiceRecords(DATE) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCutoffDate ALIAS FOR $1;

BEGIN

-- Remove the shipitem records
  DELETE FROM shipitem
  WHERE (shipitem_invcitem_id IN (SELECT invcitem_id 
                                  FROM invcitem 
                                  WHERE invcitem_invchead_id IN ( SELECT invchead_id
                                     FROM invchead
                                     WHERE ( (invchead_invcdate <= pCutoffDate)
                                     AND   (checkInvoiceSitePrivs(invchead_id))
                                     AND   (invchead_posted) ) ) ) );

-- Remove the cobill and cobmisc records
  DELETE FROM cobill
  WHERE (cobill_cobmisc_id IN ( SELECT cobmisc_id
                                FROM cobmisc, invchead
                                WHERE ( (invchead_invcnumber=cobmisc_invcnumber::TEXT)
                                  AND   (checkInvoiceSitePrivs(invchead_id))
                                  AND   (cobmisc_invcdate <= pCutoffDate)
                                  AND   (cobmisc_posted)) ) );

  DELETE FROM cobmisc
  WHERE ( (checkInvoiceSitePrivs(getInvcheadId(cobmisc_invcnumber::TEXT)))
    AND   (cobmisc_invcdate <= pCutoffDate)
    AND   (cobmisc_posted) );

-- Remove the invchead and invcitem records
  DELETE FROM invcitem
  WHERE (invcitem_invchead_id IN ( SELECT invchead_id
                                   FROM invchead
                                   WHERE ( (invchead_invcdate <= pCutoffDate)
                                     AND   (checkInvoiceSitePrivs(invchead_id))
                                     AND   (invchead_posted) ) ) );

  DELETE FROM invchead
  WHERE ( (invchead_invcdate <= pCutoffDate)
    AND   (checkInvoiceSitePrivs(invchead_id))
    AND   (invchead_posted) );

  RETURN 1;

END;
' LANGUAGE 'plpgsql';
