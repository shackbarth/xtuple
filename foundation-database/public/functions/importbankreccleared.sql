
CREATE OR REPLACE FUNCTION importBankrecCleared(pBankrecid INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _bankrecid INTEGER;
  _result INTEGER := 0;
  _cleared BOOLEAN;
  _doctype TEXT;
  _docid INTEGER := -1;
  _bankadjid INTEGER := -1;
  _debitbankadjtypeid INTEGER := -1;
  _creditbankadjtypeid INTEGER := -1;
  _b RECORD;
  _r RECORD;

BEGIN
  -- cache some information
  IF (pBankrecid = -1) THEN
    _bankrecid := fetchMetricValue('ImportBankRecId');
  ELSE
    _bankrecid := pBankrecid;
  END IF;

  SELECT * INTO _b
  FROM bankrec JOIN bankaccnt ON (bankaccnt_id=bankrec_bankaccnt_id)
  WHERE (bankrec_id=_bankrecid);
  IF (NOT FOUND) THEN
    RAISE EXCEPTION 'bankrec not found';
  END IF;
  IF (_b.bankrec_posted) THEN
    RAISE EXCEPTION 'bankrec already posted';
  END IF;

   _debitbankadjtypeid := fetchMetricValue('ImportBankRecDebitAdj');
  IF (_debitbankadjtypeid = -1) THEN
    RAISE EXCEPTION 'Metric ImportBankRecDebitAdj not defined [xtuple: reconcileBankAccount, -1]';
  END IF;

   _creditbankadjtypeid := fetchMetricValue('ImportBankRecCreditAdj');
  IF (_creditbankadjtypeid = -1) THEN
    RAISE EXCEPTION 'Metric ImportBankRecCreditAdj not defined [xtuple: reconcileBankAccount, -2]';
  END IF;

  -- loop thru bankrecimport and toggle cleared items
  FOR _r IN
  SELECT *,
         COALESCE(bankrecimport_debit_amount, 0.0) AS debit,
         COALESCE(bankrecimport_credit_amount, 0.0) AS credit
  FROM bankrecimport
-- TODO how to handle multiple bank accounts
--  WHERE (bankrecimport_?=_b.bankaccnt=?)
  LOOP

    -- TODO how to handle duplicate document numbers
    -- TODO how to handle amount differences
    -- TODO add support for Project Accounting (sltrans)

    IF ( (_r.debit > 0.0) AND (_r.credit > 0.0) ) THEN
      RAISE NOTICE 'Bankrecimport % cannot determine if debit or credit', _r.bankrecimport_reference;
      CONTINUE;
    END IF;

    IF (_r.debit > 0.0) THEN

      -- handle receipts

      SELECT cashrcpt_id INTO _docid
      FROM cashrcpt
      WHERE (cashrcpt_docnumber=_r.bankrecimport_reference)
        AND (cashrcpt_posted)
        AND (NOT cashrcpt_void)
      -- TODO workaround for duplicates
      ORDER BY cashrcpt_id DESC
      LIMIT 1;
      IF (FOUND) THEN
        SELECT toggleBankrecCleared(_b.bankrec_id, 'GL', gltrans_id,
                                    cashrcpt_curr_rate, _r.debit,
                                    _r.bankrecimport_effdate) INTO _cleared
        FROM gltrans LEFT OUTER JOIN bankrecitem ON (bankrecitem_source='GL' AND
                                                     bankrecitem_source_id=gltrans_id)
        WHERE (gltrans_source='A/R')
          AND (gltrans_doctype='CR')
          AND (gltrans_misc_id=_docid)
          AND (NOT gltrans_rec)
          AND (gltrans_accnt_id=_b.bankaccnt_accnt_id)
          AND (NOT COALESCE(bankrecitem_cleared, FALSE));
      ELSE

        -- create and toggle bank adjustment
        -- TODO define bank adjustment names

        _bankadjid := -1;
        SELECT bankadj_id INTO _bankadjid
        FROM bankadj JOIN bankadjtype ON (bankadjtype_id=bankadj_bankadjtype_id)
        WHERE (bankadjtype_id=_debitbankadjtypeid)
          AND (bankadj_docnumber=_r.bankrecimport_reference)
          AND (bankadj_bankaccnt_id=_b.bankaccnt_id);
        IF (NOT FOUND) THEN
          INSERT INTO bankadj
            (bankadj_bankaccnt_id, bankadj_bankadjtype_id, bankadj_date,
             bankadj_docnumber, bankadj_amount, bankadj_notes,
             bankadj_curr_id)
          VALUES
            (_b.bankaccnt_id, _debitbankadjtypeid, _r.bankrecimport_effdate,
             _r.bankrecimport_reference, _r.debit, 'Import Bankrec Adjustment',
             _b.bankaccnt_curr_id)
          RETURNING bankadj_id INTO _bankadjid;
        END IF;

        SELECT toggleBankrecCleared(_b.bankrec_id, 'AD', _bankadjid,
                                    1.0, _r.debit,
                                    _r.bankrecimport_effdate) INTO _cleared
        FROM bankadj LEFT OUTER JOIN bankrecitem ON (bankrecitem_source='AD' AND
                                                     bankrecitem_source_id=bankadj_id)
        WHERE (bankadj_id=_bankadjid)
          AND (NOT COALESCE(bankrecitem_cleared, FALSE));
      END IF;

      -- done with receipts

    ELSE

      -- handle checks

      SELECT checkhead_id INTO _docid
      FROM checkhead
      WHERE (checkhead_number::TEXT=_r.bankrecimport_reference)
        AND (checkhead_posted)
        AND (NOT checkhead_void);
      IF (FOUND) THEN
        SELECT toggleBankrecCleared(_b.bankrec_id, 'GL', gltrans_id,
                                    checkhead_curr_rate, _r.credit,
                                    _r.bankrecimport_effdate) INTO _cleared
        FROM gltrans LEFT OUTER JOIN bankrecitem ON (bankrecitem_source='GL' AND
                                                     bankrecitem_source_id=gltrans_id)
        WHERE (gltrans_source='A/P')
          AND (gltrans_doctype='CK')
          AND (gltrans_misc_id=_docid)
          AND (NOT gltrans_rec)
          AND (gltrans_accnt_id=_b.bankaccnt_accnt_id)
          AND (NOT COALESCE(bankrecitem_cleared, FALSE));
      ELSE

        -- create and toggle bank adjustment
        -- TODO define bank adjustment names

        _bankadjid := -1;
        SELECT bankadj_id INTO _bankadjid
        FROM bankadj JOIN bankadjtype ON (bankadjtype_id=bankadj_bankadjtype_id)
        WHERE (bankadjtype_id=_creditbankadjtypeid)
          AND (bankadj_docnumber=_r.bankrecimport_reference);
        IF (NOT FOUND) THEN
          INSERT INTO bankadj
            (bankadj_bankaccnt_id, bankadj_bankadjtype_id, bankadj_date,
             bankadj_docnumber, bankadj_amount, bankadj_notes,
             bankadj_curr_id)
          VALUES
            (_b.bankaccnt_id, _creditbankadjtypeid, _r.bankrecimport_effdate,
             _r.bankrecimport_reference, _r.credit, 'Import Bankrec Adjustment',
             _b.bankaccnt_curr_id)
          RETURNING bankadj_id INTO _bankadjid;
        END IF;

        SELECT toggleBankrecCleared(_b.bankrec_id, 'AD', _bankadjid,
                                    1.0, _r.credit,
                                    _r.bankrecimport_effdate) INTO _cleared
        FROM bankadj LEFT OUTER JOIN bankrecitem ON (bankrecitem_source='AD' AND
                                                     bankrecitem_source_id=_bankadjid)
        WHERE (NOT COALESCE(bankrecitem_cleared, FALSE));
      END IF;

      -- done with checks

    END IF;

  END LOOP;

  RETURN _result;
END;
$$ LANGUAGE 'plpgsql';

