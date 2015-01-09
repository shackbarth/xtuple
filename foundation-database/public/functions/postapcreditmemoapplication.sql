CREATE OR REPLACE FUNCTION postAPCreditMemoApplication(pApopenid INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _src RECORD;
  _r RECORD;
  _totalAmount NUMERIC := 0.0;
  _exchGain NUMERIC := 0.0;
  _apaccntid INTEGER;

BEGIN

  -- pApopenid is the apopen_id of the C/M being applied

  SELECT apopen_docnumber, (apopen_amount - apopen_paid) AS balance,
	 SUM(apcreditapply_amount) AS toApply
	 INTO _src
  FROM apopen JOIN apcreditapply ON (apcreditapply_source_apopen_id=apopen_id)
  WHERE (apopen_id=pApopenid)
  GROUP BY apopen_docnumber, apopen_amount, apopen_paid;
  IF (NOT FOUND) THEN
    RAISE EXCEPTION 'A/P Credit Memo applications not found [xtuple: postAPCreditMemoApplication, -1]';
  ELSIF (_src.toApply = 0) THEN
    RAISE EXCEPTION 'A/P Credit Memo application amount is zero. [xtuple: postAPCreditMemoApplication, -2]';
  ELSIF (_src.toApply > _src.balance) THEN
    RAISE EXCEPTION 'A/P Credit Memo application amount greater than balance. [xtuple: postAPCreditMemoApplication, -3]';
  ELSIF (_src.toApply IS NULL) THEN
    RAISE EXCEPTION 'A/P Credit Memo application amount is null. [xtuple: postAPCreditMemoApplication, -4]';
  END IF;

  -- cache the C/M
  SELECT * INTO _src
  FROM apopen
  WHERE (apopen_id=pApopenid);
  IF (NOT FOUND) THEN
    RETURN -5;
  END IF;

  -- loop thru the pending applications
  FOR _r IN SELECT apcreditapply_id, apcreditapply_target_apopen_id,
                   apcreditapply_amount AS apply_amountSource,
                   currToCurr(apcreditapply_curr_id, apopen_curr_id,
                              apcreditapply_amount, CURRENT_DATE) AS apply_amountTarget,
                   apopen_id, apopen_doctype, apopen_docnumber,
                   apopen_curr_id, apopen_curr_rate, apopen_docdate,
                   (apopen_amount - apopen_paid) AS targetBalance
            FROM apcreditapply JOIN apopen ON (apcreditapply_target_apopen_id=apopen_id)
            WHERE (apcreditapply_source_apopen_id=pApopenid) LOOP

    IF (_r.apply_amountTarget IS NULL) THEN
      RAISE EXCEPTION 'A/P Credit Memo application amount is null. [xtuple: postAPCreditMemoApplication, -4]';
    END IF;

    IF (_r.apply_amountTarget > _r.targetBalance) THEN
      RAISE EXCEPTION 'A/P Credit Memo application amount greater than target balance. [xtuple: postAPCreditMemoApplication, -7]';
    END IF;

    IF (_r.apply_amountTarget > 0) THEN

      --  Update the apopen item to post the paid amount
      UPDATE apopen
      SET apopen_paid = (apopen_paid + _r.apply_amountTarget)
      WHERE (apopen_id=_r.apcreditapply_target_apopen_id);

      UPDATE apopen
      SET apopen_open = false,
          apopen_closedate = CURRENT_DATE
      WHERE ( (apopen_id=_r.apcreditapply_target_apopen_id)
        AND (apopen_amount <= apopen_paid) );

      --  Cache the running amount posted
      _totalAmount := (_totalAmount + _r.apply_amountSource);

      --  Record the application
      INSERT INTO apapply
      ( apapply_vend_id, apapply_amount,
        apapply_source_apopen_id, apapply_source_doctype, apapply_source_docnumber,
        apapply_target_apopen_id, apapply_target_doctype, apapply_target_docnumber,
        apapply_postdate, apapply_journalnumber, apapply_username, apapply_curr_id )
      VALUES
      ( _src.apopen_vend_id, round(_r.apply_amountSource, 2),
        pApopenid, 'C', _src.apopen_docnumber,
        _r.apopen_id, _r.apopen_doctype, _r.apopen_docnumber,
        CURRENT_DATE, 0, getEffectiveXtUser(), _src.apopen_curr_id );

    END IF;

    --  Delete the posted apcreditapply record
    DELETE FROM apcreditapply
    WHERE (apcreditapply_id=_r.apcreditapply_id);

  END LOOP;

  --  Record the amount posted and mark the source apopen as closed if it is completely posted
  UPDATE apopen
  SET apopen_paid = (apopen_paid + _totalAmount)
  WHERE (apopen_id=pApopenid);

  UPDATE apopen
  SET apopen_open = false,
      apopen_closedate = CURRENT_DATE
  WHERE ( (apopen_id=pApopenid)
    AND (apopen_amount <= apopen_paid) );

  IF (_r.apopen_curr_id = _src.apopen_curr_id) THEN
    IF (_r.apopen_docdate > _src.apopen_docdate) THEN
      _exchGain := (_totalAmount / _r.apopen_curr_rate - _totalAmount / _src.apopen_curr_rate) * -1;
    ELSE
      _exchGain := _totalAmount / _src.apopen_curr_rate - _totalAmount / _r.apopen_curr_rate;
    END IF;
  END IF;

-- do not post gain/loss to alternate prepaid
--  IF (_src.apopen_accnt_id > -1) THEN
--    _apaccntid := _src.apopen_accnt_id;
--  ELSE 
    _apaccntid := findAPAccount(_src.apopen_vend_id);
--  END IF;

  PERFORM insertGLTransaction(fetchJournalNumber('AP-MISC'), 'A/P', 'CM',
                              _src.apopen_docnumber, 'CM Application',
                              _apaccntid,
                              getGainLossAccntId(_apaccntid), -1,
                              _exchGain,
                              CURRENT_DATE);

  RETURN pApopenid;

END;
$$ LANGUAGE plpgsql;
