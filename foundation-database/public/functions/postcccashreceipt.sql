CREATE OR REPLACE FUNCTION postCCcashReceipt(pCCpay   INTEGER,
                                             pdocid   INTEGER,
                                             pdoctype TEXT    DEFAULT NULL,
                                             pamount  NUMERIC DEFAULT NULL) RETURNS INTEGER AS
$$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _aropenid     INTEGER;
  _bankaccnt_id INTEGER;
  _c            RECORD;
  _ccOrderDesc  TEXT;
  _journal      INTEGER;
  _realaccnt    INTEGER;
  _return       INTEGER := 0;

BEGIN
  SELECT * INTO _c
     FROM ccpay
     JOIN custinfo ON ccpay_cust_id = cust_id
     WHERE (ccpay_id = pCCpay);

  IF (NOT FOUND) THEN
    RAISE EXCEPTION 'Cannot find the Credit Card transaction information [xtuple: postCCcashReceipt, -11, %]',
                    pCCpay;
  END IF;

  IF (pamount IS NOT NULL) THEN
    _c.ccpay_amount = pamount;
  END IF;

  SELECT bankaccnt_id, bankaccnt_accnt_id INTO _bankaccnt_id, _realaccnt
  FROM ccbank
  JOIN bankaccnt ON (ccbank_bankaccnt_id=bankaccnt_id)
  WHERE (ccbank_ccard_type=_c.ccpay_card_type);

  IF (_bankaccnt_id IS NULL) THEN
    RAISE EXCEPTION 'Cannot find the default Bank Account for this Credit Card [xtuple: postCCcredit, -1, %]',
                    _c.ccpay_card_type;
  END IF;

  _ccOrderDesc := (_c.ccpay_card_type || '-' || _c.ccpay_order_number::TEXT ||
                  '-' || _c.ccpay_order_number_seq::TEXT);

  _journal := fetchJournalNumber('C/R');

  IF (pdoctype = 'cashrcpt') THEN
    IF (COALESCE(pdocid, -1) < 0) THEN
      INSERT INTO cashrcpt (
        cashrcpt_cust_id,   cashrcpt_amount,     cashrcpt_curr_id,
        cashrcpt_fundstype, cashrcpt_docnumber,  cashrcpt_notes,
        cashrcpt_distdate,  cashrcpt_bankaccnt_id,
        cashrcpt_usecustdeposit
      ) VALUES (
        _c.ccpay_cust_id,   _c.ccpay_amount,     _c.ccpay_curr_id,
        _c.ccpay_card_type,      _c.ccpay_r_ordernum, _ccOrderDesc,
        CURRENT_DATE,       _bankaccnt_id,
        fetchMetricBool('EnableCustomerDeposits'))
      RETURNING cashrcpt_id INTO _return;
    ELSE
      UPDATE cashrcpt
      SET cashrcpt_cust_id=_c.ccpay_cust_id,
          cashrcpt_amount=_c.ccpay_amount,
          cashrcpt_curr_id=_c.ccpay_curr_id,
          cashrcpt_fundstype=_c.ccpay_card_type,
          cashrcpt_docnumber=_c.ccpay_r_ordernum,
          cashrcpt_notes=_ccOrderDesc,
          cashrcpt_distdate=CURRENT_DATE,
          cashrcpt_bankaccnt_id=_bankaccnt_id
      WHERE (cashrcpt_id=pdocid);
      _return := pdocid;
    END IF;

  ELSIF (pdoctype = 'cohead') THEN
    SELECT createARCreditMemo(NULL,               _c.ccpay_cust_id,
                             fetchArMemoNumber(), cohead_number,
                             CURRENT_DATE,        _c.ccpay_amount,
                             'Unapplied from ' || _ccOrderDesc,
                             NULL,                NULL, NULL,
                             CURRENT_DATE,        NULL,
                             cohead_salesrep_id,  NULL,
                             _journal,            _c.ccpay_curr_id,
                             NULL,                pCCpay) INTO _aropenid
      FROM cohead
     WHERE cohead_id = pdocid;
    IF (COALESCE(_aropenid, -1) < 0) THEN       -- coalesce handles not-found case
      RAISE EXCEPTION '[xtuple: createARCreditMemo, %]', _aropenid;
    END IF;

    INSERT INTO payaropen (payaropen_ccpay_id, payaropen_aropen_id,
                           payaropen_amount,   payaropen_curr_id)
                  VALUES  (pccpay,             _aropenid,
                           _c.ccpay_amount,    _c.ccpay_curr_id);
    INSERT INTO aropenalloc (aropenalloc_aropen_id, aropenalloc_doctype, aropenalloc_doc_id,
                             aropenalloc_amount,    aropenalloc_curr_id)
                     VALUES (_aropenid, 'S',          pdocid,
                             _c.ccpay_amount,    _c.ccpay_curr_id);
    _return := _aropenid;
  END IF;

  PERFORM insertGLTransaction(_journal, 'A/R', 'CR', _ccOrderDesc,
                              ('Cash Receipt from Credit Card ' || _c.cust_name),
                              findPrepaidAccount(_c.ccpay_cust_id),
                              _realaccnt,
                              NULL,
                              ROUND(currToBase(_c.ccpay_curr_id,
                                               _c.ccpay_amount,
                                               _c.ccpay_transaction_datetime::DATE),2),
                              CURRENT_DATE);

  RETURN _return;
END;
$$ LANGUAGE 'plpgsql';
