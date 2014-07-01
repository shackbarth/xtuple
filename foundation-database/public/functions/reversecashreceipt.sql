CREATE OR REPLACE FUNCTION reverseCashReceipt(INTEGER, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCashrcptid ALIAS FOR $1;
  pJournalNumber ALIAS FOR $2;
  _p RECORD;
  _r RECORD;
  _postToAR NUMERIC;
  _postToMisc NUMERIC;
  _posted_base NUMERIC := 0;
  _posted NUMERIC := 0;
  _sequence INTEGER;
  _aropenid INTEGER;
  _arMemoNumber TEXT;
  _arAccntid INTEGER;
  _closed BOOLEAN;
  _debitAccntid INTEGER;
  _exchGain NUMERIC;
  _comment      TEXT;
  _ccpayid  INTEGER;
  _cctype TEXT;

BEGIN
  _posted := 0;
  _posted_base := 0;

  SELECT fetchGLSequence() INTO _sequence;

  SELECT accnt_id INTO _arAccntid
  FROM cashrcpt, accnt, salescat
  WHERE ((cashrcpt_salescat_id=salescat_id)
    AND  (salescat_ar_accnt_id=accnt_id)
    AND  (cashrcpt_id=pCashrcptid));
  IF (NOT FOUND) THEN
    SELECT accnt_id INTO _arAccntid
    FROM cashrcpt, accnt
    WHERE ( (findARAccount(cashrcpt_cust_id)=accnt_id)
     AND (cashrcpt_id=pCashrcptid) );
    IF (NOT FOUND) THEN
      RETURN -5;
    END IF;
  END IF;

  SELECT cashrcpt_cust_id, ('Reverse Cash Receipt posting for ' || cust_number||'-'||cust_name) AS custnote,
         cashrcpt_fundstype, cashrcpt_number, cashrcpt_docnumber,
         cashrcpt_distdate, cashrcpt_amount, cashrcpt_discount,
         (cashrcpt_amount / cashrcpt_curr_rate) AS cashrcpt_amount_base,
         (cashrcpt_discount / cashrcpt_curr_rate) AS cashrcpt_discount_base,
         cashrcpt_notes,
         cashrcpt_bankaccnt_id AS bankaccnt_id,
         accnt_id AS prepaid_accnt_id,
         cashrcpt_usecustdeposit,
         cashrcpt_curr_id, cashrcpt_curr_rate INTO _p
  FROM accnt, cashrcpt LEFT OUTER JOIN custinfo ON (cashrcpt_cust_id=cust_id)
  WHERE ( (findPrepaidAccount(cashrcpt_cust_id)=accnt_id)
   AND (cashrcpt_id=pCashrcptid) );
  IF (NOT FOUND) THEN
    RETURN -7;
  END IF;

  IF (_p.cashrcpt_fundstype IN ('A', 'D', 'M', 'V')) THEN
    SELECT ccpay_id, ccpay_type INTO _ccpayid, _cctype
    FROM ccpay
    WHERE ((ccpay_r_ordernum IN (CAST(pCashrcptid AS TEXT), _p.cashrcpt_docnumber))
       AND (ccpay_status IN ('C', 'A')));

    IF NOT FOUND THEN
      -- the following select seems to work except for xikar - bug 8848. why?
      -- raise warning so there is some visibility if people fall into this path.
      SELECT ccpay_id, ccpay_type INTO _ccpayid, _cctype
      FROM ccpay
      WHERE ((ccpay_order_number IN (CAST(pCashrcptid AS TEXT), _p.cashrcpt_docnumber))
         AND (ccpay_status IN ('C', 'A')));
      IF (NOT FOUND) THEN
        RETURN -8;
      ELSE
        RAISE NOTICE 'PostCashReceipt() found ccpay_id % for order number %/% (ref 8848).',
                      _ccpayid, pCashrcptid, _p.cashrcpt_docnumber;
      END IF;
    END IF;

-- If there is a ccpay entry and the card was charged directly, use the prepaid account
    IF (_cctype = 'C' ) THEN
      _debitAccntid := findPrepaidAccount(_p.cashrcpt_cust_id);
-- If there is a ccpay entry and the card was preauthed and then charged, use the Bank account
    ELSE
      SELECT accnt_id INTO _debitAccntid
      FROM cashrcpt, bankaccnt, accnt
      WHERE ( (cashrcpt_bankaccnt_id=bankaccnt_id)
       AND (bankaccnt_accnt_id=accnt_id)
       AND (cashrcpt_id=pCashrcptid) );
      IF (NOT FOUND) THEN
        RETURN -6;
      END IF;
    END IF;
  ELSE
    SELECT accnt_id INTO _debitAccntid
    FROM cashrcpt, bankaccnt, accnt
    WHERE ( (cashrcpt_bankaccnt_id=bankaccnt_id)
     AND (bankaccnt_accnt_id=accnt_id)
     AND (cashrcpt_id=pCashrcptid) );
    IF (NOT FOUND) THEN
      RETURN -6;
    END IF;
  END IF;

--  Determine the amount to post to A/R Open Items
  SELECT COALESCE(SUM(cashrcptitem_amount),0) INTO _postToAR
  FROM cashrcptitem JOIN aropen ON (aropen_id=cashrcptitem_aropen_id)
  WHERE ((cashrcptitem_cashrcpt_id=pCashrcptid)
   AND (cashrcptitem_applied));
  IF (NOT FOUND) THEN
    _postToAR := 0;
  END IF;

--  Determine the amount to post to Misc. Distributions
  SELECT COALESCE(SUM(cashrcptmisc_amount),0) INTO _postToMisc
  FROM cashrcptmisc
  WHERE (cashrcptmisc_cashrcpt_id=pCashrcptid);
  IF (NOT FOUND) THEN
    _postToMisc := 0;
  END IF;

--  Check to see if the C/R is over applied
  IF ((_postToAR + _postToMisc) > _p.cashrcpt_amount) THEN
    RETURN -1;
  END IF;

--  Check to see if the C/R is positive amount
  IF (_p.cashrcpt_amount <= 0) THEN
    RETURN -2;
  END IF;

--  Distribute A/R Applications
  FOR _r IN SELECT aropen_id, aropen_doctype, aropen_docnumber, aropen_docdate,
                   aropen_duedate, aropen_curr_id, aropen_curr_rate,
                   round(aropen_amount - aropen_paid, 2) <=
                      round(aropen_paid + 
                      currToCurr(_p.cashrcpt_curr_id, aropen_curr_id,abs(cashrcptitem_amount + cashrcptitem_discount),_p.cashrcpt_distdate),2)
                               AS closed,
                   cashrcptitem_id, cashrcptitem_amount, cashrcptitem_discount,
                   (cashrcptitem_amount / _p.cashrcpt_curr_rate) AS cashrcptitem_amount_base,
                   (cashrcptitem_discount / _p.cashrcpt_curr_rate) AS cashrcptitem_discount_base,
                   round(aropen_paid - 
                      currToCurr(_p.cashrcpt_curr_id, aropen_curr_id,abs(cashrcptitem_amount),_p.cashrcpt_distdate),2) AS new_paid,
                   round(currToCurr(_p.cashrcpt_curr_id, aropen_curr_id,abs(cashrcptitem_discount),_p.cashrcpt_distdate),2) AS new_discount
            FROM cashrcptitem JOIN aropen ON (cashrcptitem_aropen_id=aropen_id)
            WHERE ((cashrcptitem_cashrcpt_id=pCashrcptid)
              AND (cashrcptitem_applied)) LOOP

--  Handle discount 
    IF (_r.cashrcptitem_discount_base > 0) THEN
      PERFORM reverseCashReceiptDisc(_r.cashrcptitem_id, pJournalNumber);
    END IF;
     
--  Update the aropen item to post the paid amount
    UPDATE aropen
    SET aropen_paid = _r.new_paid - _r.new_discount,
        aropen_open = TRUE,
        aropen_closedate = NULL
    WHERE (aropen_id=_r.aropen_id);

--  Cache the running amount posted
    _posted_base := _posted_base + _r.cashrcptitem_amount_base;
    _posted := _posted + _r.cashrcptitem_amount;

--  Record the cashrcpt application
    IF (_r.aropen_doctype IN ('I','D')) THEN
      INSERT INTO arapply
      ( arapply_cust_id,
        arapply_source_aropen_id, arapply_source_doctype, arapply_source_docnumber,
        arapply_target_aropen_id, arapply_target_doctype, arapply_target_docnumber,
        arapply_fundstype, arapply_refnumber, arapply_reftype, arapply_ref_id,
        arapply_applied, arapply_closed,
        arapply_postdate, arapply_distdate, arapply_journalnumber, arapply_username,
        arapply_curr_id
       )
      VALUES
      ( _p.cashrcpt_cust_id,
        -1, 'K', _p.cashrcpt_number,
        _r.aropen_id, _r.aropen_doctype, _r.aropen_docnumber,
        _p.cashrcpt_fundstype, _p.cashrcpt_docnumber, 'CRA', _r.cashrcptitem_id,
        (round(_r.cashrcptitem_amount, 2) * -1.0), _r.closed,
        CURRENT_DATE, _p.cashrcpt_distdate, pJournalNumber, getEffectiveXtUser(), _p.cashrcpt_curr_id );
    ELSE
      INSERT INTO arapply
      ( arapply_cust_id,
        arapply_source_aropen_id, arapply_source_doctype, arapply_source_docnumber,
        arapply_target_aropen_id, arapply_target_doctype, arapply_target_docnumber,
        arapply_fundstype, arapply_refnumber, arapply_reftype, arapply_ref_id,
        arapply_applied, arapply_closed, arapply_postdate, arapply_distdate,
        arapply_journalnumber, arapply_username, arapply_curr_id )
      VALUES
      ( _p.cashrcpt_cust_id,
        _r.aropen_id, _r.aropen_doctype, _r.aropen_docnumber,
        -1, 'R', _p.cashrcpt_number,
        '', '', 'CRA', _r.cashrcptitem_id,
        (round(abs(_r.cashrcptitem_amount), 2) * -1.0), _r.closed,
        CURRENT_DATE, _p.cashrcpt_distdate, pJournalNumber, getEffectiveXtUser(), _p.cashrcpt_curr_id );
    END IF;

    _exchGain := arCurrGain(_r.aropen_id,_p.cashrcpt_curr_id, abs(_r.cashrcptitem_amount),
                           _p.cashrcpt_distdate);

    PERFORM insertIntoGLSeries( _sequence, 'A/R', 'CR',
                        (_r.aropen_doctype || '-' || _r.aropen_docnumber),
                        CASE WHEN _r.aropen_doctype != 'R' THEN _arAccntid
                        ELSE findDeferredAccount(_p.cashrcpt_cust_id) END, 
                        (round(_r.cashrcptitem_amount_base + _exchGain, 2) * -1.0),
                        _p.cashrcpt_distdate, _p.custnote );

    IF (_exchGain <> 0) THEN
        PERFORM insertIntoGLSeries(_sequence, 'A/R', 'CR',
               _r.aropen_doctype || '-' || _r.aropen_docnumber,
               getGainLossAccntId(
               CASE WHEN _r.aropen_doctype != 'R' THEN _arAccntid
               ELSE findDeferredAccount(_p.cashrcpt_cust_id) END
               ), round(_exchGain, 2),
               _p.cashrcpt_distdate, _p.custnote);

    END IF;

  END LOOP;

--  Distribute Misc. Applications
  FOR _r IN SELECT cashrcptmisc_id, cashrcptmisc_accnt_id, cashrcptmisc_amount,
                   (cashrcptmisc_amount / _p.cashrcpt_curr_rate) AS cashrcptmisc_amount_base,
                   cashrcptmisc_notes
            FROM cashrcptmisc
            WHERE (cashrcptmisc_cashrcpt_id=pCashrcptid)  LOOP

--  Cache the running amount posted
    _posted_base := (_posted_base + _r.cashrcptmisc_amount_base);
    _posted := (_posted + _r.cashrcptmisc_amount);

--  Record the cashrcpt application
    INSERT INTO arapply
    ( arapply_cust_id,
      arapply_source_aropen_id, arapply_source_doctype, arapply_source_docnumber,
      arapply_target_aropen_id, arapply_target_doctype, arapply_target_docnumber,
      arapply_fundstype, arapply_refnumber,
      arapply_applied, arapply_closed,
      arapply_postdate, arapply_distdate, arapply_journalnumber, arapply_username,
      arapply_curr_id, arapply_reftype, arapply_ref_id )
    VALUES
    ( _p.cashrcpt_cust_id,
      -1, 'K', '',
      -1, 'Misc.', '',
      _p.cashrcpt_fundstype, _p.cashrcpt_docnumber,
      (round(_r.cashrcptmisc_amount, 2) * -1.0), TRUE,
      CURRENT_DATE, _p.cashrcpt_distdate, pJournalNumber, getEffectiveXtUser(), 
      _p.cashrcpt_curr_id, 'CRD', _r.cashrcptmisc_id );

    PERFORM insertIntoGLSeries( _sequence, 'A/R', 'CR', _r.cashrcptmisc_notes,
                                _r.cashrcptmisc_accnt_id,
                                (round(_r.cashrcptmisc_amount_base, 2) * -1.0),
                                _p.cashrcpt_distdate, _p.custnote );

  END LOOP;

--  Post any remaining Cash to an A/R Debit Memo
--  this credit memo may absorb an occasional currency exchange rounding error
  IF (round(_posted_base, 2) < round(_p.cashrcpt_amount_base, 2)) THEN
    _comment := ('Unapplied from ' || _p.cashrcpt_fundstype || '-' || _p.cashrcpt_docnumber);
    PERFORM insertIntoGLSeries( _sequence, 'A/R', 'CR',
                                _comment,
                                _p.prepaid_accnt_id,
                                ((round(_p.cashrcpt_amount_base, 2) - round(_posted_base, 2)) * -1.0),
                                _p.cashrcpt_distdate, _p.custnote );
    SELECT fetchArMemoNumber() INTO _arMemoNumber;
    -- Post A/R Debit Memo
    SELECT createARDebitMemo(NULL, _p.cashrcpt_cust_id, pJournalNumber, _arMemoNumber, '',
                              _p.cashrcpt_distdate, (_p.cashrcpt_amount - _posted),
                              _comment, -1, -1, -1, _p.cashrcpt_distdate, -1, NULL, 0,
                              _p.cashrcpt_curr_id) INTO _aropenid;
    -- Create Cash Receipt Item to capture posting
    INSERT INTO cashrcptitem
      ( cashrcptitem_cashrcpt_id, cashrcptitem_aropen_id, cashrcptitem_amount )
    VALUES
      ( pCashrcptid, _aropenid, ((_p.cashrcpt_amount - _posted) * 1.0) );

  ELSIF (round(_posted_base, 2) > round(_p.cashrcpt_amount_base, 2)) THEN
    PERFORM insertIntoGLSeries(_sequence, 'A/R', 'CR',
                   'Currency Exchange Rounding - ' || _p.cashrcpt_docnumber,
                   getGainLossAccntId(_debitAccntid),
                   ((round(_posted_base, 2) - round((_p.cashrcpt_amount_base + _p.cashrcpt_discount_base), 2)) * 1.0),
                   _p.cashrcpt_distdate, _p.custnote);
  END IF;

--  Debit Cash
  PERFORM insertIntoGLSeries( _sequence, 'A/R', 'CR',
                    (_p.cashrcpt_fundstype || '-' || _p.cashrcpt_docnumber),
                     _debitAccntid, round(_p.cashrcpt_amount_base, 2),
                     _p.cashrcpt_distdate,
                     _p.custnote );

  PERFORM postGLSeries(_sequence, pJournalNumber);

--  Update and void the posted cashrcpt
  UPDATE cashrcpt SET cashrcpt_posted=FALSE,
                      cashrcpt_posteddate=NULL,
                      cashrcpt_postedby=NULL,
                      cashrcpt_void=TRUE
  WHERE (cashrcpt_id=pCashrcptid);

  RETURN 1;

END;
$$ LANGUAGE 'plpgsql';
