CREATE OR REPLACE FUNCTION createAPDiscount(INTEGER, NUMERIC) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pApopenid ALIAS FOR $1;
  pAmount ALIAS FOR $2;
  _result INTEGER;
  
BEGIN

  SELECT createAPDiscount(pApopenid, fetchJournalNumber('AP-MISC'), pAmount) INTO _result;

  RETURN _result;

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION createAPDiscount(INTEGER, INTEGER, NUMERIC) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pApopenid ALIAS FOR $1;
  pJournalNumber ALIAS FOR $2;
  pAmount ALIAS FOR $3;
  _ap RECORD;
  _sequence INTEGER;
  _apopenid INTEGER;
  _apcreditapplyid INTEGER;
  _result INTEGER;
  _crAccnt INTEGER;
  _dbAccnt INTEGER;
  _reference    TEXT;
  _discountDateAmt NUMERIC;

BEGIN

  SELECT NEXTVAL('apopen_apopen_id_seq') INTO _apopenid;

  SELECT * INTO _ap
  FROM apopen
  WHERE (apopen_id = pApopenid);
  IF (NOT FOUND) THEN
    RETURN -1;
  END IF;

  _crAccnt := findAPDiscountAccount(_ap.apopen_vend_id);
  _dbAccnt := findAPAccount(_ap.apopen_vend_id);
  _reference := ('Discount for ' || _ap.apopen_doctype || ' ' || _ap.apopen_docnumber);

  SELECT fetchGLSequence() INTO _sequence;

  _discountDateAmt = round(pAmount / _ap.apopen_curr_rate, 2);
  PERFORM insertIntoGLSeries( _sequence, 'A/P', 'DS', _ap.apopen_docnumber,
                              _dbAccnt,
                              _discountDateAmt * -1,
                              CURRENT_DATE,
                              _reference);
  PERFORM insertIntoGLSeries( _sequence, 'A/P', 'DS', _ap.apopen_docnumber,
                              _crAccnt,
                              _discountDateAmt,
                              CURRENT_DATE,
                              _reference);

  PERFORM postGLSeries(_sequence, pJournalNumber);

  INSERT INTO apopen
  ( apopen_id, apopen_username, apopen_journalnumber,
    apopen_vend_id, apopen_docnumber, apopen_doctype, apopen_ponumber,
    apopen_docdate, apopen_duedate, apopen_distdate, apopen_terms_id, apopen_curr_id,
    apopen_amount, apopen_paid, apopen_open, apopen_notes, apopen_discount, apopen_curr_rate )
  SELECT _apopenid, getEffectiveXtUser(), pJournalNumber,
         apopen_vend_id, apopen_docnumber, 'C', apopen_ponumber,
         CURRENT_DATE, CURRENT_DATE, CURRENT_DATE, -1, apopen_curr_id,
         pAmount, 0, TRUE, _reference, TRUE, apopen_curr_rate
    FROM apopen
   WHERE (apopen_id=pApopenid);

  SELECT apcreditapply_id INTO _apcreditapplyid
    FROM apcreditapply
   WHERE ( (apcreditapply_source_apopen_id=_apopenid)
     AND   (apcreditapply_target_apopen_id=pApopenid) );
  IF (FOUND) THEN
    UPDATE apcreditapply
       SET apcreditapply_amount=pAmount
     WHERE (apcreditapply_id=_apcreditapplyid);
  ELSE
    SELECT nextval('apcreditapply_apcreditapply_id_seq') INTO _apcreditapplyid;
    INSERT INTO apcreditapply
           ( apcreditapply_id, apcreditapply_source_apopen_id,
             apcreditapply_target_apopen_id, apcreditapply_amount,
             apcreditapply_curr_id )
    VALUES ( _apcreditapplyid, _apopenid, pApopenid, pAmount, _ap.apopen_curr_id );
  END IF;

  SELECT postAPCreditMemoApplication(_apopenid) INTO _result;

  IF (_result < 0) THEN
    RETURN _result;
  END IF;

  RETURN pJournalNumber;

END;
$$ LANGUAGE 'plpgsql';
