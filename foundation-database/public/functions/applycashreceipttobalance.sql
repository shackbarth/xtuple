CREATE OR REPLACE FUNCTION applyCashReceiptToBalance(INTEGER, NUMERIC) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCashrcptid ALIAS FOR $1;
  pAmount ALIAS FOR $2;

BEGIN
  RETURN applyCashReceiptToBalance(pCashrcptid, pAmount, baseCurrId() );
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION applyCashReceiptToBalance(INTEGER, NUMERIC, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCashrcptid ALIAS FOR $1;
  pAmount ALIAS FOR $2;
  pCurrId ALIAS FOR $3;

BEGIN

  RETURN applyCashReceiptToBalance(pCashrcptid, pAmount, pCurrId, false);

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION applyCashReceiptToBalance(INTEGER, NUMERIC, INTEGER, BOOLEAN) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCashrcptid ALIAS FOR $1;
  pAmount ALIAS FOR $2;
  pCurrId ALIAS FOR $3;
  pInclCredits ALIAS FOR $4;
  _amount NUMERIC;
  _applied NUMERIC := 0;
  _applyAmount NUMERIC;
  _discount NUMERIC;
  _discprct NUMERIC;
  _docDate DATE;
  _r RECORD;
  _toApply NUMERIC;

BEGIN

--  Apply open credits first if applicable
  IF (pInclCredits) THEN
    -- First find total debits unaccounted for by this receipt so we can apply as much credit 
    -- as possible to clear, but no more
    SELECT coalesce(noNeg(sum(currToCurr(aropen_curr_id, cashrcpt_curr_id,
         aropen_amount - aropen_paid, cashrcpt_distdate) -
         COALESCE((SELECT (SUM(cashrcptitem_amount) + SUM(cashrcptitem_discount))
                   FROM cashrcptitem, cashrcpt
                   WHERE ((cashrcpt_id=cashrcptitem_cashrcpt_id)
                     AND  (NOT cashrcpt_void)
                     AND  (NOT cashrcpt_posted)
                     AND  (cashrcpt_id != pCashrcptid)
                     AND  (cashrcptitem_aropen_id=aropen_id))), 0)) - pAmount),0)
    INTO _toApply
    FROM cashrcpt
      JOIN custinfo ON (cashrcpt_cust_id=cust_id)
      JOIN aropen ON (cust_id=aropen_cust_id)
    WHERE ((cashrcpt_id=pCashrcptid)
      AND (aropen_open)
      AND (aropen_doctype IN ('I','D')));
           
    -- Loop through and apply credits until we account for all remaining debits we can
    FOR _r IN 
      SELECT aropen_id
      FROM cashrcpt
        JOIN custinfo ON (cashrcpt_cust_id=cust_id)
        JOIN aropen ON (cust_id=aropen_cust_id)
      WHERE ((cashrcpt_id=pCashrcptid)
        AND (aropen_open)
        AND (aropen_doctype IN ('C','R')))
      ORDER BY aropen_duedate, aropen_docnumber
    LOOP
     EXIT WHEN _toApply <= 0;
      _toApply := _toApply - applyCashReceiptLineBalance(pCashrcptid, _r.aropen_id, _toApply, pCurrId);
    END LOOP;
  END IF;

--  Find the balance to apply
  SELECT (currToCurr(pCurrId, cashrcpt_curr_id, pAmount, cashrcpt_distdate) -
              (COALESCE(SUM(cashrcptitem_amount), 0) ) ),
              COALESCE(cashrcpt_docdate, current_date) 
              INTO _amount, _docDate
  FROM cashrcpt LEFT OUTER JOIN cashrcptitem ON (cashrcptitem_cashrcpt_id = cashrcpt_id)
  WHERE (cashrcpt_id=pCashrcptid)
  GROUP BY cashrcpt_curr_id, cashrcpt_distdate, cashrcpt_docdate;

  SELECT (_amount - COALESCE(SUM(cashrcptmisc_amount), 0)) INTO _amount
  FROM cashrcptmisc
  WHERE (cashrcptmisc_cashrcpt_id=pCashrcptid);

  IF (_amount = 0) THEN
    RETURN 1;
  END IF;

--  Loop through the aropen item in order of due date, searching only for
--  aropen items that are open, for the current customer and have an outstanding balance
  FOR _r IN SELECT aropen_id,
               currToCurr(aropen_curr_id, cashrcpt_curr_id,
               aropen_amount - aropen_paid, cashrcpt_distdate) -
               COALESCE((SELECT SUM(cashrcptitem_amount) + SUM(cashrcptitem_discount)
                           FROM cashrcptitem, cashrcpt
                           WHERE ((cashrcpt_id=cashrcptitem_cashrcpt_id)
                             AND  (NOT cashrcpt_void)
                             AND  (NOT cashrcpt_posted)
                             AND  (cashrcpt_id != pCashrcptId)
                             AND  (cashrcptitem_aropen_id=aropen_id))), 0) AS balance,
                   s.cashrcptitem_id AS cashrcptitem_id
            FROM cashrcpt, aropen LEFT OUTER JOIN
                 cashrcptitem s ON (s.cashrcptitem_aropen_id=aropen_id AND s.cashrcptitem_cashrcpt_id=pCashrcptId)
                 LEFT OUTER JOIN terms ON (aropen_terms_id=terms_id),
                 (SELECT COALESCE(SUM(arapply_applied), 0.00) AS applied  
                  FROM arapply, aropen 
                  WHERE ((arapply_target_aropen_id=aropen_id) 
                    AND (arapply_source_aropen_id=aropen_id) 
                    AND  (aropen_discount) )
                 ) AS data

            WHERE ( (aropen_cust_id=cashrcpt_cust_id)
             AND (aropen_doctype IN ('I', 'D'))
             AND (aropen_open)
             AND (cashrcpt_id=pCashrcptid) )
            ORDER BY aropen_duedate, aropen_amount, balance LOOP

--  Determine Max Discount as per Terms
    SELECT  round(noNeg(_r.balance * 
            CASE WHEN (_docDate <= determineDiscountDate(terms_id, aropen_docdate)) THEN terms_discprcnt 
            ELSE 0.00 END - applied),2),
            CASE WHEN (_docDate <= determineDiscountDate(terms_id, aropen_docdate)) THEN terms_discprcnt 
            ELSE 0.00 END INTO _discount, _discprct
            FROM aropen LEFT OUTER JOIN terms ON (terms_id=aropen_terms_id), 
                 (SELECT COALESCE(SUM(arapply_applied), 0.00) AS applied  
		          FROM arapply, aropen 
                  WHERE ((arapply_target_aropen_id=_r.aropen_id) 
                  AND (arapply_source_aropen_id=_r.aropen_id) 
                  AND  (aropen_discount) )
                 ) AS data 
            WHERE (aropen_id=_r.aropen_id);

--  Determine the amount to apply
    IF (_r.balance <= _amount + _discount) THEN
      _applyAmount := _r.balance - _discount;
    ELSE
      _discount := round((_amount / (1 - _discprct)) - _amount, 2);
      _applyAmount := _amount;
    END IF;

    IF (_applyAmount > 0) THEN
--  Does an cashrcptitem already exist?
      IF (_r.cashrcptitem_id IS NOT NULL) THEN
--  Update the cashrcptitem with the new amount to apply
        UPDATE cashrcptitem
        SET cashrcptitem_amount = round(cashrcptitem_amount + _applyAmount, 2),
            cashrcptitem_discount = round(_discount, 2)
        WHERE (cashrcptitem_id=_r.cashrcptitem_id);
      ELSE
--  Create a new cashrcptitem
        INSERT INTO cashrcptitem
        ( cashrcptitem_aropen_id, cashrcptitem_cashrcpt_id,
          cashrcptitem_amount, cashrcptitem_discount )
        VALUES
        ( _r.aropen_id, pCashrcptid, round(_applyAmount, 2), round(_discount, 2) );
      END IF;

      _amount := (_amount - _applyAmount);
      IF (round(_amount, 2) = 0) THEN
        EXIT;
      END IF;

    END IF;
  END LOOP;

  RETURN 1;

END;
$$ LANGUAGE 'plpgsql';
