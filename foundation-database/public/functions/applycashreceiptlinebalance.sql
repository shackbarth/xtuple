CREATE OR REPLACE FUNCTION applyCashReceiptLineBalance(INTEGER, INTEGER, NUMERIC, INTEGER) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCashrcptId ALIAS FOR $1;
  pAropenid ALIAS FOR $2;
  pAmount ALIAS FOR $3;
  pCurrId ALIAS FOR $4;
  _balance NUMERIC;
  _amount NUMERIC;
  _applyAmount NUMERIC := 0;
  _discount NUMERIC := 0;
  _discprct NUMERIC;
  _docDate DATE;
  _r RECORD;
  _doctype CHAR(1);

BEGIN

--  All calculations performed in currency of Cash Receipt

--  Clear previously applied
  DELETE FROM cashrcptitem WHERE ((cashrcptitem_cashrcpt_id=pCashrcptId) AND (cashrcptitem_aropen_id=pAropenId));

--  Find the balance to apply
  SELECT (pAmount - (COALESCE(SUM(cashrcptitem_amount), 0) ) ),
    COALESCE(cashrcpt_docdate, current_date)
    INTO _amount, _docDate
  FROM cashrcpt LEFT OUTER JOIN cashrcptitem ON (cashrcptitem_cashrcpt_id = cashrcpt_id)
  WHERE (cashrcpt_id=pCashrcptid)
  GROUP BY cashrcpt_curr_id, cashrcpt_distdate, cashrcpt_docdate;

  SELECT (_amount - COALESCE(SUM(cashrcptmisc_amount), 0)) INTO _amount
  FROM cashrcptmisc
  WHERE (cashrcptmisc_cashrcpt_id=pCashrcptid);

  SELECT aropen_doctype INTO _doctype
  FROM aropen
  WHERE (aropen_id=pAropenId);
  
  RAISE DEBUG 'Amount (%) DocType (%)', _amount, _doctype;

  IF (_amount <= 0 AND _doctype IN ('I','D')) THEN
    RETURN 0;
  END IF;

--  Determine Line balance
  SELECT currToCurr(aropen_curr_id, cashrcpt_curr_id,
         aropen_amount - aropen_paid, cashrcpt_distdate) -
         COALESCE((SELECT (SUM(cashrcptitem_amount) + SUM(cashrcptitem_discount))
                   FROM cashrcptitem, cashrcpt
                   WHERE ((cashrcpt_id=cashrcptitem_cashrcpt_id)
                     AND  (NOT cashrcpt_void)
                     AND  (NOT cashrcpt_posted)
                     AND  (cashrcpt_id != pCashrcptId)
                     AND  (cashrcptitem_aropen_id=pAropenId))), 0)
         INTO _balance
         FROM aropen, cashrcpt
           WHERE ((aropen_id=pAropenId)
           AND (cashrcpt_id=pCashrcptId));

  RAISE DEBUG 'Balance (%)', _balance;
            
--  If Invoice or Debit Memo, determine Max Discount as per Terms
  IF (_doctype IN ('I','D')) THEN
    SELECT  round(noNeg(_balance * 
            CASE WHEN (_docDate <= determineDiscountDate(terms_id, aropen_docdate)) THEN COALESCE(terms_discprcnt, 0.0) 
            ELSE 0.00 END - applied),2),
            CASE WHEN (_docDate <= determineDiscountDate(terms_id, aropen_docdate)) THEN COALESCE(terms_discprcnt, 0.0) 
            ELSE 0.00 END INTO _discount, _discprct
    FROM aropen LEFT OUTER JOIN terms ON (terms_id=aropen_terms_id), 
         (SELECT COALESCE(SUM(arapply_applied), 0.00) AS applied  
	  FROM arapply, aropen 
          WHERE ((arapply_target_aropen_id=pAropenId) 
           AND (arapply_source_aropen_id=pAropenId) 
           AND  (aropen_discount) )
             ) AS data 
    WHERE (aropen_id=pAropenId);

--  Determine the amount to apply
    IF (_balance <= _amount + _discount) THEN
      _applyAmount := _balance - _discount;
    ELSE
      _discount := round((_amount / (1 - _discprct)) - _amount, 2);
      _applyAmount := _amount;
    END IF;
  ELSIF (_doctype IN ('C', 'R')) THEN
  -- Handle Credits, discounts don't apply here
    _applyAmount := _balance * -1;
  ELSE
    _applyAmount := _amount;
  END IF;

  IF (_applyAmount != 0) THEN
--  Create a new cashrcptitem
      INSERT INTO cashrcptitem
      ( cashrcptitem_aropen_id, cashrcptitem_cashrcpt_id,
        cashrcptitem_amount,cashrcptitem_discount )
      VALUES
      ( pAropenid, pCashrcptid, round(_applyAmount, 2), round(_discount, 2) );
  END IF;

  RETURN abs(_applyAmount);

END;
$$ LANGUAGE 'plpgsql';

