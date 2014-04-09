
CREATE OR REPLACE FUNCTION selectPayment(INTEGER, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pApopenid ALIAS FOR $1;
  pBankaccntid ALIAS FOR $2;
  _p RECORD;
  _apselectid INTEGER;
  _amount NUMERIC;
  _discount NUMERIC;
BEGIN

  SELECT apopen_amount, apopen_paid,
         apopen_doctype, apopen_docdate,
         apopen_curr_id,
         apopen_amount - apopen_paid - apCheckPending(apopen_id) AS balance,
         noNeg(COALESCE(apopen_discountable_amount, 0) *
               CASE WHEN (CURRENT_DATE <= determineDiscountDate(apopen_terms_id, apopen_docdate)) THEN terms_discprcnt
                    ELSE 0.0 END - discount_applied) AS discount_available
    INTO _p
    FROM apopen LEFT OUTER JOIN terms ON (apopen_terms_id=terms_id),
         (SELECT COALESCE(SUM(apapply_amount),0) AS discount_applied
            FROM apapply, apopen
           WHERE((apapply_target_apopen_id=pApopenid)
             AND (apapply_source_apopen_id=apopen_id)
             AND (apopen_discount)) ) AS data
   WHERE(apopen_id=pApopenid);
  IF(NOT FOUND OR (NOT _p.apopen_doctype IN ('V','D','C'))) THEN
    RETURN -1;
  END IF;

  _discount := round(_p.discount_available, 2);
  _amount := noNeg(round(_p.balance, 2) - _discount);

  IF (round(_p.balance,2) < (_discount + _amount)) THEN
    RETURN -2;
  END IF;

  IF (_amount > 0) THEN
    SELECT apselect_id INTO _apselectid
    FROM apselect
    WHERE (apselect_apopen_id=pApopenid);

    IF (FOUND) THEN
      UPDATE apselect
         SET apselect_amount=_amount,
             apselect_discount=_discount,
             apselect_curr_id = _p.apopen_curr_id
       WHERE(apselect_id=_apselectid);
    ELSE
      SELECT NEXTVAL('apselect_apselect_id_seq') INTO _apselectid;

      INSERT INTO apselect
      ( apselect_id, apselect_apopen_id,
        apselect_amount, apselect_discount,
        apselect_bankaccnt_id,
        apselect_curr_id, apselect_date )
      VALUES
      ( _apselectid, pApopenid,
        _amount, _discount,
        pBankaccntid,
        _p.apopen_curr_id, _p.apopen_docdate );
    END IF;
  ELSE
    _apselectid := 0;
  END IF;
  
  RETURN _apselectid;

END;
$$ LANGUAGE 'plpgsql';
