CREATE OR REPLACE FUNCTION deleteCashrcpt(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pcashrcptid ALIAS FOR $1;
  _ccreceipt    BOOLEAN;

BEGIN

  IF EXISTS(SELECT cashrcpt_id
            FROM cashrcpt
            JOIN ccpay ON (cashrcpt_cust_id=ccpay_cust_id)
                       AND ((CASE WHEN TRIM(COALESCE(cashrcpt_docnumber, ''))='' THEN TEXT(cashrcpt_id)
                                  ELSE cashrcpt_docnumber
                             END)=ccpay_order_number)
            WHERE ((cashrcpt_fundstype IN ('A', 'D', 'M', 'V'))
               AND (ccpay_status NOT IN ('D', 'X'))
               AND (ccpay_id NOT IN (SELECT payco_ccpay_id FROM payco))
               AND (cashrcpt_id=pcashrcptid))) THEN
    RETURN -1;
  END IF;

  IF EXISTS(SELECT cashrcpt_id
            FROM cashrcpt
            WHERE ( (cashrcpt_id=pcashrcptid)
              AND   (cashrcpt_posted) )) THEN
    RETURN -2;
  END IF;

  -- If there are applications for this Cash Receipt then
  -- it has been posted and reversed.  Void instead of delete.
  IF EXISTS(SELECT cashrcpt_id
            FROM cashrcpt JOIN cashrcptitem ON (cashrcptitem_cashrcpt_id=cashrcpt_id)
                          JOIN arapply ON ((arapply_reftype='CRA') AND
                                           (arapply_ref_id=cashrcptitem_id))
            WHERE (cashrcpt_id=pcashrcptid))
     OR
     EXISTS(SELECT cashrcpt_id
            FROM cashrcpt JOIN cashrcptmisc ON (cashrcptmisc_cashrcpt_id=cashrcpt_id)
                          JOIN arapply ON ((arapply_reftype='CRD') AND
                                           (arapply_ref_id=cashrcptmisc_id))
            WHERE (cashrcpt_id=pcashrcptid)) THEN
    UPDATE cashrcpt SET cashrcpt_void = TRUE
    WHERE (cashrcpt_id=pcashrcptid);
    RETURN 1;
  END IF;

  DELETE FROM cashrcptitem
  WHERE (cashrcptitem_cashrcpt_id=pcashrcptid);

  DELETE FROM cashrcptmisc
  WHERE (cashrcptmisc_cashrcpt_id=pcashrcptid);

  DELETE FROM cashrcpt
  WHERE (cashrcpt_id=pcashrcptid);

  RETURN 1;

END;
$$ LANGUAGE 'plpgsql';
