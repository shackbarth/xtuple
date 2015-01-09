CREATE OR REPLACE FUNCTION postCCcredit(INTEGER, TEXT, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCCpay        ALIAS FOR $1;
  preftype      ALIAS FOR $2;
  prefid        ALIAS FOR $3;
  _c            RECORD;
  _ccOrderDesc  TEXT;
  _cglaccnt     INTEGER;
  _dglaccnt     INTEGER;
  _glseriesres  INTEGER;
  _notes        TEXT := 'Credit via Credit Card';
  _r            RECORD;
  _sequence     INTEGER;
  _dmaropenid   INTEGER;

BEGIN
  IF ((preftype = 'cohead') AND NOT EXISTS(SELECT cohead_id
                                           FROM cohead
                                           WHERE (cohead_id=prefid))) THEN
    RAISE EXCEPTION 'Cannot find original Sales Order for this Credit Card credit [xtuple: postCCcredit, -2, %, %, %]',
                    pCCpay, preftype, prefid;
  ELSIF ((preftype = 'aropen') AND NOT EXISTS(SELECT aropen_id
                                              FROM aropen
                                              WHERE (aropen_id=prefid))) THEN
    RAISE EXCEPTION 'Cannot find original A/R Open record for this Credit Card credit [xtuple: postCCcredit, -2, %, %, %]',
                    pCCpay, preftype, prefid;
  ELSIF ((preftype = 'cmhead') AND NOT EXISTS(SELECT cmhead_id
                                              FROM cmhead
                                              WHERE cmhead_id=prefid)) THEN
    RAISE EXCEPTION 'Cannot find original Credit Memo record for this Credit Card credit [xtuple: postCCcredit, -2, %, %, %]',
                    pCCpay, preftype, prefid;
  END IF;

  SELECT * INTO _c
  FROM ccpay
  WHERE (ccpay_id = pCCpay);

  IF (NOT FOUND) THEN
    RAISE EXCEPTION 'Cannot find the record for this Credit Card credit [xtuple: postCCcredit, -3, %, %, %]',
                    pCCpay, preftype, prefid;
  END IF;

  IF (preftype = 'cohead') THEN
    _dglaccnt := findPrepaidAccount(_c.ccpay_cust_id);
  ELSE
    _dglaccnt := findARAccount(_c.ccpay_cust_id);
  END IF;

  SELECT bankaccnt_accnt_id INTO _cglaccnt
  FROM ccbank
  JOIN bankaccnt ON (ccbank_bankaccnt_id=bankaccnt_id)
  WHERE (ccbank_ccard_type=_c.ccpay_card_type);

  IF (NOT FOUND) THEN
    RAISE EXCEPTION 'Cannot find the default Bank Account for this Credit Card [xtuple: postCCcredit, -1, %]',
                    pCCpay;
  END IF;

  IF (_c.ccpay_type != 'R') THEN
    RAISE EXCEPTION 'This Credit Card transaction is not a credit/refund [xtuple: postCCcredit, -4, %]',
                    pCCpay;
  END IF;

  _sequence := fetchGLSequence();

  IF (_c.ccpay_r_ref IS NOT NULL) THEN
    _ccOrderDesc := (_c.ccpay_card_type || '-' || _c.ccpay_r_ref);
  ELSE
    _ccOrderDesc := (_c.ccpay_card_type || '-' || _c.ccpay_order_number::TEXT ||
                    '-' || COALESCE(_c.ccpay_order_number_seq::TEXT, ''));
  END IF;

  _glseriesres := insertIntoGLSeries(_sequence, 'A/R', 'CC', _ccOrderDesc,
                                     _dglaccnt,
                                     ROUND(currToBase(_c.ccpay_curr_id,
                                                      _c.ccpay_amount,
                                                      _c.ccpay_transaction_datetime::DATE), 2) * -1,
                                     CURRENT_DATE, _notes);
  IF (_glseriesres < 0) THEN
    RAISE EXCEPTION 'Could not write debit side of Credit Card credit to the G/L [xtuple: insertIntoGLSeries, %]',
                    _glseriesres;
  END IF;

  _glseriesres := insertIntoGLSeries(_sequence, 'A/R', 'CC', _ccOrderDesc,
                                     _cglaccnt,
                                     ROUND(currToBase(_c.ccpay_curr_id,
                                                      _c.ccpay_amount,
                                                      _c.ccpay_transaction_datetime::DATE),2),
                                     CURRENT_DATE, _notes);
  IF (_glseriesres < 0) THEN
    RAISE EXCEPTION 'Could not write credit side of Credit Card credit to the G/L [xtuple: insertIntoGLSeries, %]',
                    _glseriesres;
  END IF;

  _glseriesres := postGLSeries(_sequence, fetchJournalNumber('C/R') );
  IF (_glseriesres < 0) THEN
    RAISE EXCEPTION 'Could not post Credit Card credit to the G/L [xtuple: postglseries, %]',
                    _glseriesres;
  END IF;

  IF (preftype = 'aropen') THEN
    SELECT * INTO _r
    FROM aropen
    WHERE (aropen_id=prefid);

  ELSE
    SELECT aropen.* INTO _r
    FROM ccpay n
      JOIN ccpay o  ON (o.ccpay_id=n.ccpay_ccpay_id)
      JOIN payaropen ON (payaropen_ccpay_id=o.ccpay_id)
      JOIN aropen ON (payaropen_aropen_id=aropen_id)
    WHERE (n.ccpay_id=pCCpay);
  END IF;

  IF (FOUND) THEN
    SELECT createardebitmemo(
            NULL,
            _r.aropen_cust_id, NULL, fetchARMemoNumber(),
            _r.aropen_ordernumber, current_date, _c.ccpay_amount,
            _notes,
            -1, -1, -1, CURRENT_DATE, -1, NULL, 0,
            _r.aropen_curr_id) INTO _dmaropenid;

    IF (_r.aropen_open) THEN
      PERFORM applyARCreditMemoToBalance(_r.aropen_id, _dmaropenid);
      PERFORM postARCreditMemoApplication(_r.aropen_id);
    END IF;

  END IF;

  IF (preftype = 'cohead') THEN
    INSERT INTO payco (
      payco_ccpay_id, payco_cohead_id, payco_amount, payco_curr_id
    ) VALUES (
      pCCpay, prefid, 0 - _c.ccpay_amount, _c.ccpay_curr_id
    );
  END IF;

  RETURN 0;

END;
$$
LANGUAGE 'plpgsql';
