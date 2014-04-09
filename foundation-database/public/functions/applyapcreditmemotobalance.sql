CREATE OR REPLACE FUNCTION applyAPCreditMemoToBalance(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pApopenid ALIAS FOR $1;
  _amount NUMERIC;
  _curr_id INTEGER;
  _curr_rate NUMERIC;
  _docdate DATE;
  _applyAmount NUMERIC;
  _r RECORD;
  _p RECORD;

BEGIN

--  Find the balance to apply
  SELECT (apopen_amount - apopen_paid - COALESCE(prepared,0.0) - COALESCE(selected,0.0) - COALESCE(SUM(currToCurr(apcreditapply_curr_id,
                                                  apopen_curr_id,
                                                  apcreditapply_amount,
                                                  apopen_docdate)), 0)),
          apopen_curr_id, apopen_curr_rate, apopen_docdate INTO _amount, _curr_id, _curr_rate, _docdate
  FROM apopen 
    LEFT OUTER JOIN apcreditapply ON (apcreditapply_source_apopen_id=apopen_id)
    LEFT OUTER JOIN (SELECT apopen_id AS selected_apopen_id,
                       SUM(currToCurr(apselect_curr_id, apopen_curr_id, apselect_amount + apselect_discount, apselect_date)) AS selected
                     FROM apselect JOIN apopen ON (apselect_apopen_id=apopen_id)
                     GROUP BY apopen_id) AS sub1 ON (apopen_id=selected_apopen_id)
    LEFT OUTER JOIN (SELECT apopen_id AS prepared_apopen_id,
                       SUM(checkitem_amount + checkitem_discount) AS prepared
                     FROM checkhead 
                       JOIN checkitem ON (checkitem_checkhead_id=checkhead_id)
                       JOIN apopen ON (checkitem_apopen_id=apopen_id)
                     WHERE ((NOT checkhead_posted)
                       AND  (NOT checkhead_void))
                     GROUP BY apopen_id) AS sub2 ON (prepared_apopen_id=apopen_id)
  WHERE (apopen_id=pApopenid)
  GROUP BY apopen_amount, apopen_paid, apopen_curr_id, apopen_curr_rate, apopen_docdate, prepared, selected;

  IF (_amount < 0) THEN
    RETURN -1;
  END IF;

--  Loop through the apopen items in order of due date
  FOR _r IN SELECT target.apopen_id AS apopenid,
                   currToCurr(target.apopen_curr_id,source.apopen_curr_id, 
                     target.apopen_amount - target.apopen_paid - COALESCE(prepared,0.0) - COALESCE(selected,0.0) - COALESCE(applied,0.0),
                     current_date) AS balance
           FROM apopen AS source, apopen AS target
             LEFT OUTER JOIN (SELECT apcreditapply_target_apopen_id AS applied_apopen_id,
                                     SUM(currToCurr(apcreditapply_curr_id, apopen_curr_id, apcreditapply_amount, apopen_docdate)) AS applied
                              FROM apcreditapply JOIN apopen ON (apopen_id=apcreditapply_source_apopen_id)
                              GROUP BY apcreditapply_target_apopen_id) AS sub3
                              ON (target.apopen_id=applied_apopen_id)
             LEFT OUTER JOIN (SELECT apopen_id AS selected_apopen_id,
                                SUM(currToCurr(apselect_curr_id, apopen_curr_id, apselect_amount + apselect_discount, apselect_date)) AS selected
                                    FROM apselect JOIN apopen ON (apselect_apopen_id=apopen_id)
                                GROUP BY apopen_id) AS sub1
                                ON (target.apopen_id=selected_apopen_id)
             LEFT OUTER JOIN (SELECT apopen_id AS prepared_apopen_id,
                                SUM(checkitem_amount + checkitem_discount) AS prepared
                              FROM checkhead 
                                JOIN checkitem ON (checkitem_checkhead_id=checkhead_id)
                                JOIN apopen ON (checkitem_apopen_id=apopen_id)
                              WHERE ((NOT checkhead_posted)
                               AND  (NOT checkhead_void))
                              GROUP BY apopen_id) AS sub2 ON (prepared_apopen_id=target.apopen_id)
            WHERE ( (source.apopen_vend_id=target.apopen_vend_id)
             AND (target.apopen_doctype IN ('V', 'D'))
             AND (target.apopen_open)
             AND (source.apopen_id=pApopenid) )
            ORDER BY target.apopen_duedate, (target.apopen_amount - target.apopen_paid) LOOP

--  Determine the amount to apply
    IF (_r.balance <= 0.0) THEN
      CONTINUE;
    ELSEIF (_r.balance > _amount) THEN
      _applyAmount := _amount;
    ELSE
      _applyAmount := _r.balance;
    END IF;

--  Does an apcreditapply record already exist?
    SELECT apcreditapply_id, 
              apcreditapply_amount * _curr_rate / 
                 currRate(apcreditapply_curr_id,_docdate) AS apcreditapply_amount
      INTO _p
    FROM apcreditapply
    WHERE ( (apcreditapply_target_apopen_id=_r.apopenid)
     AND (apcreditapply_source_apopen_id=pApopenid) );

    IF (FOUND) THEN
--  The following is depreciated, just skip the record
--  Recalculate the amount to apply
--      IF ((_r.balance - _p.apcreditapply_amount) > _amount) THEN
--        _applyAmount := _amount;
--      ELSE
--        _applyAmount := (_r.balance - _p.apcreditapply_amount);
--      END IF;

--  Update the apcreditapply with the new amount to apply
--      UPDATE apcreditapply
--      SET apcreditapply_amount = (apcreditapply_amount + 
--          _applyAmount *  currRate(apcreditapply_curr_id,_docdate) / _curr_rate)
--      WHERE (apcreditapply_id=_p.apcreditapply_id);

      CONTINUE;
    ELSE
--  Create a new apcreditapply record
      INSERT INTO apcreditapply
      ( apcreditapply_source_apopen_id, apcreditapply_target_apopen_id,
        apcreditapply_amount, apcreditapply_curr_id )
      VALUES
      ( pApopenid, _r.apopenid, _applyAmount, _curr_id );
    END IF;

    _amount := (_amount - _applyAmount);
    IF (_amount = 0) THEN
      EXIT;
    END IF;

  END LOOP;

  RETURN 1;

END;
$$ LANGUAGE 'plpgsql';
