CREATE OR REPLACE FUNCTION applyARCreditMemoToBalance(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pAropenid ALIAS FOR $1;

BEGIN

  RETURN applyARCreditMemoToBalance(pAropenid, NULL);

END;
$$ LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION applyARCreditMemoToBalance(INTEGER, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pSourceAropenid ALIAS FOR $1;
  pTargetAropenid ALIAS FOR $2;
  _amount NUMERIC;
  _amountcurrid INTEGER;
  _applyAmount NUMERIC;
  _applycurrid  INTEGER;
  _curr_rate NUMERIC;
  _r RECORD;
  _p RECORD;

BEGIN

--  Find the balance to apply
  SELECT (aropen_amount - COALESCE(SUM(currToCurr(arcreditapply_curr_id,
                                                  aropen_curr_id,
                                                  arcreditapply_amount,
                                                  aropen_docdate)), 0) - aropen_paid - COALESCE(prepared,0.0) - COALESCE(cashapplied,0.0)),
         aropen_curr_id, aropen_curr_rate INTO _amount, _amountcurrid, _curr_rate
  FROM aropen LEFT OUTER JOIN arcreditapply ON (arcreditapply_source_aropen_id=aropen_id)
	      LEFT OUTER JOIN (SELECT aropen_id AS prepared_aropen_id,
                                SUM(checkitem_amount + checkitem_discount) AS prepared
                               FROM checkhead JOIN checkitem ON (checkitem_checkhead_id=checkhead_id)
                                              JOIN aropen ON (checkitem_aropen_id=aropen_id)
                               WHERE ((NOT checkhead_posted)
                                AND  (NOT checkhead_void))
                               GROUP BY aropen_id) AS sub1
                      ON (prepared_aropen_id=aropen_id)
             LEFT OUTER JOIN (SELECT aropen_id AS cash_aropen_id,
                                     SUM(cashrcptitem_amount + cashrcptitem_discount) * -1.0 AS cashapplied
                                FROM cashrcpt JOIN cashrcptitem ON (cashrcptitem_cashrcpt_id=cashrcpt_id)
                                              JOIN aropen ON (cashrcptitem_aropen_id=aropen_id)
                               WHERE (NOT cashrcpt_posted) AND (NOT cashrcpt_void)
                               GROUP BY aropen_id ) AS sub2
                      ON (cash_aropen_id=aropen_id)
  WHERE (aropen_id=pSourceAropenid)
  GROUP BY aropen_amount, aropen_paid, aropen_curr_id, aropen_curr_rate, prepared, cashapplied;

  IF (_amount < 0) THEN
    RETURN -1;
  END IF;

--  Loop through the aropen items in order of due date
  FOR _r IN SELECT target.aropen_id AS aropenid,
                   currToCurr(target.aropen_curr_id,source.aropen_curr_id,
                              (target.aropen_amount - target.aropen_paid - calcpendingarapplications(target.aropen_id)),
                              current_date) AS balance,
                   target.aropen_curr_id AS curr_id,
                   target.aropen_docdate AS docdate
            FROM aropen AS target, aropen AS source
            WHERE ( (source.aropen_cust_id=target.aropen_cust_id)
             AND (target.aropen_doctype IN ('D', 'I'))
             AND (target.aropen_open)
             AND (source.aropen_id=pSourceAropenid)
             AND ((pTargetAropenid IS NULL) OR (target.aropen_id=pTargetAropenid)) )
            ORDER BY target.aropen_duedate, target.aropen_docnumber LOOP

--  Determine the amount to apply
    IF (_r.balance > _amount) THEN
      _applyAmount := _amount;
    ELSE
      _applyAmount := _r.balance;
    END IF;
    _applycurrid := _amountcurrid;

--  Does an arcreditapply record already exist?
    SELECT arcreditapply_id,
           arcreditapply_amount,
           arcreditapply_amount * _curr_rate / 
                 currRate(arcreditapply_curr_id,_r.docdate) AS
                      arcreditapply_amount_applycurr INTO _p
    FROM arcreditapply
    WHERE ( (arcreditapply_target_aropen_id=_r.aropenid)
     AND (arcreditapply_source_aropen_id=pSourceAropenid) );

    IF (FOUND) THEN
--  Offset the amount to apply by the amount already applied
      _applyAmount := (_applyAmount - _p.arcreditapply_amount_applycurr);
      IF (_applyAmount < 0) THEN
        _applyAmount := 0;
      END IF;

--  Update the arcreditapply with the new amount to apply
      UPDATE arcreditapply
      SET arcreditapply_amount = (arcreditapply_amount + 
          _applyAmount *  currRate(arcreditapply_curr_id,_r.docdate) / _curr_rate)
      WHERE (arcreditapply_id=_p.arcreditapply_id);

    ELSE
--  Create a new arcreditapply record
      INSERT INTO arcreditapply
      ( arcreditapply_source_aropen_id, arcreditapply_target_aropen_id,
        arcreditapply_amount, arcreditapply_curr_id )
      VALUES
      ( pSourceAropenid, _r.aropenid, _applyAmount, _applycurrid );
    END IF;

    _amount := _amount - currToCurr(_applycurrid, _amountcurrid, _applyAmount, _r.docdate);
    IF (_amount = 0) THEN
      EXIT;
    END IF;

  END LOOP;

  RETURN 1;

END;
$$ LANGUAGE 'plpgsql';

