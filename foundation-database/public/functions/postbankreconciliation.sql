
CREATE OR REPLACE FUNCTION postBankReconciliation(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2012 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pBankrecid ALIAS FOR $1;
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

-- Delete any bankrecitem records that are not marked as cleared for cleanliness
  DELETE FROM bankrecitem
   WHERE ( (NOT bankrecitem_cleared)
     AND   (bankrecitem_bankrec_id=pBankrecid) );

-- Post any bankadj items that were marked as cleared and convert the bankrecitem
  FOR _r IN SELECT bankrecitem_id, bankrecitem_source_id
              FROM bankrecitem, bankadj
             WHERE ( (bankrecitem_source = 'AD')
               AND   (bankrecitem_source_id=bankadj_id)
               AND   (bankrecitem_cleared)
               AND   (NOT bankadj_posted)
               AND   (bankrecitem_bankrec_id=pBankrecid) ) LOOP

    SELECT postBankAdjustment(_r.bankrecitem_source_id) INTO _sequence;

    IF (_sequence < 0) THEN
      RETURN -10;
    END IF;

    SELECT gltrans_id INTO _gltransid
      FROM gltrans
     WHERE ( (gltrans_sequence=_sequence)
       AND   (gltrans_accnt_id=_accntid) );
    IF ( NOT FOUND ) THEN
      RETURN -11;
    END IF;

    UPDATE bankrecitem
       SET bankrecitem_source = 'GL',
           bankrecitem_source_id=_gltransid
     WHERE (bankrecitem_id=_r.bankrecitem_id);

  END LOOP;

-- Mark all the gltrans items that have been cleared as reconciled.
  UPDATE gltrans
     SET gltrans_rec = TRUE
   WHERE ( (gltrans_id IN (SELECT bankrecitem_source_id
                             FROM bankrecitem
                            WHERE ((bankrecitem_source = 'GL')
                              AND  (bankrecitem_cleared)
                              AND  (bankrecitem_bankrec_id=pBankrecid) ) ) )
     AND   (gltrans_accnt_id=_accntid) ) ;

-- Mark all the sltrans items that have been cleared as reconciled.
  UPDATE sltrans
     SET sltrans_rec = TRUE
   WHERE ( (sltrans_id IN (SELECT bankrecitem_source_id
                             FROM bankrecitem
                            WHERE ((bankrecitem_source = 'SL')
                              AND  (bankrecitem_cleared)
                              AND  (bankrecitem_bankrec_id=pBankrecid) ) ) )
     AND   (sltrans_accnt_id=_accntid) ) ;

-- Mark the bankrec record as posted
  UPDATE bankrec SET 
    bankrec_posted = TRUE,
    bankrec_postdate = now()
   WHERE (bankrec_id=pBankrecid);

  RETURN pBankrecid;
END;
$$ LANGUAGE 'plpgsql';

