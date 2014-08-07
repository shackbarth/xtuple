
CREATE OR REPLACE FUNCTION importBankrecCleared(pBankrecid INTEGER) RETURNS BOOLEAN AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _result INTEGER := 0;
  _cleared BOOLEAN;
  _doctype TEXT;
  _docid INTEGER;
  _b RECORD;
  _r RECORD;

BEGIN
  -- cache some information
  SELECT * INTO _b
  FROM bankrec JOIN bankaccnt ON (bankaccnt_id=bankrec_bankaccnt_id)
  WHERE (bankrec_id=pBankrecid);
  IF (NOT FOUND) THEN
    RAISE EXCEPTION 'bankrec not found';
  END IF;
  IF (_b.bankrec_posted) THEN
    RAISE EXCEPTION 'bankrec already posted';
  END IF;

  -- loop thru bankrecimport and toggle cleared items
  FOR _r IN
  SELECT *,
         COALESCE(bankrecimport_debit_amount, 0.0) AS debit,
         COALESCE(bankrecimport_credit_amount, 0.0) AS credit
  FROM bankrecimport
--  WHERE (bankrecimport_?=_b.bankaccnt=?)
  LOOP

    IF ( (_r.debit > 0.0) AND (_r.credit > 0.0) ) THEN
      RAISE NOTICE 'Bankrecimport % cannot determine if debit or credit', _r.bankrecimport_reference;
      CONTINUE;
    END IF;

    IF (_r.debit > 0.0) THEN
      -- check receipts
      SELECT cashrcpt_id INTO _docid
      FROM cashrcpt
      WHERE (cashrcpt_docnumber=_r.bankrecimport_reference)
        AND (cashrcpt_posted);
      IF (FOUND) THEN
        SELECT toggleBankrecCleared(_b.bankrec_id, 'GL', gltrans_id, cashrcpt_curr_rate, _r.debit, _r.bankrecimport_effdate) INTO _cleared
        FROM cashrcpt JOIN gltrans ON ((gltrans_source='A/R')
                                  AND (gltrans_doctype='CR')
                                  AND (gltrans_accnt_id=_b.bankaccnt_accnt_id)
                                  AND (gltrans_misc_id=cashrcpt_id))
        WHERE (cashrcpt_id=_docid);
        CONTINUE;
      END IF;
    END IF;

    RAISE NOTICE 'Bankrecimport % not found', _r.bankrecimport_reference;

  END LOOP;

  RETURN _result;
END;
$$ LANGUAGE 'plpgsql';

