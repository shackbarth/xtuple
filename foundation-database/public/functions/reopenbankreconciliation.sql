
CREATE OR REPLACE FUNCTION reopenBankReconciliation(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pBankrecid ALIAS FOR $1;
  _bankrecid INTEGER;
  _accntid INTEGER;
  _sequence INTEGER;
  _gltransid INTEGER;
  _r RECORD;

BEGIN

-- Check the accnt information to make sure it is valid
  SELECT accnt_id INTO _accntid
    FROM bankrec, bankaccnt, accnt
   WHERE ( (bankaccnt_accnt_id=accnt_id)
     AND   (bankrec_bankaccnt_id=bankaccnt_id)
     AND   (bankrec_id=pBankrecid) );
  IF ( NOT FOUND ) THEN
    RETURN -1;
  END IF;

  SELECT bankrec_id INTO _bankrecid
    FROM bankrec
   WHERE (NOT bankrec_posted);
  IF (FOUND) THEN
  -- Delete any bankrecitem records for unposted periods
    DELETE FROM bankrecitem
     WHERE (bankrecitem_bankrec_id=_bankrecid);
  -- Delete any bankrec records for unposted period
    DELETE FROM bankrec
     WHERE (bankrec_id=_bankrecid);
  END IF;

-- Mark all the gltrans items that have been cleared as unreconciled.
  UPDATE gltrans
     SET gltrans_rec = FALSE
   WHERE ( (gltrans_id IN (SELECT bankrecitem_source_id
                             FROM bankrecitem
                            WHERE ((bankrecitem_source = 'GL')
                              AND  (bankrecitem_cleared)
                              AND  (bankrecitem_bankrec_id=pBankrecid) ) ) )
     AND   (gltrans_accnt_id=_accntid) ) ;

-- Mark all the sltrans items that have been cleared as unreconciled.
  UPDATE sltrans
     SET sltrans_rec = FALSE
   WHERE ( (sltrans_id IN (SELECT bankrecitem_source_id
                             FROM bankrecitem
                            WHERE ((bankrecitem_source = 'SL')
                              AND  (bankrecitem_cleared)
                              AND  (bankrecitem_bankrec_id=pBankrecid) ) ) )
     AND   (sltrans_accnt_id=_accntid) ) ;

-- Mark the bankrec record as unposted
  UPDATE bankrec SET 
    bankrec_posted = FALSE,
    bankrec_postdate = NULL
   WHERE (bankrec_id=pBankrecid);

  RETURN pBankrecid;
END;
$$ LANGUAGE 'plpgsql';

