CREATE OR REPLACE FUNCTION createARCreditMemo(pId            INTEGER,
                                              pCustid        INTEGER,
                                              pDocNumber     TEXT,
                                              pOrderNumber   TEXT,
                                              pDocDate       DATE,
                                              pAmount        NUMERIC,
                                              pNotes         TEXT,
                                              pRsncodeid     INTEGER,
                                              pSalescatid    INTEGER,
                                              pAccntid       INTEGER,
                                              pDueDate       DATE,
                                              pTermsid       INTEGER,
                                              pSalesrepid    INTEGER,
                                              pCommissiondue NUMERIC = 0,
                                              pJournalNumber INTEGER = NULL,
                                              pCurrId        INTEGER = baseCurrId(),
                                              pArAccntid     INTEGER = NULL,
                                              pCoCcpayId     INTEGER = NULL) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _accntid        INTEGER;
  _arAccntid      INTEGER;
  _aropenid       INTEGER;
  _cohistid       INTEGER;
  _custName       TEXT;
  _duedate        DATE    := COALESCE(pDueDate, pDocDate);
  _glSequence     INTEGER;
  _journalNumber  INTEGER;
  _prepaidAccntid INTEGER;
  _salescatid     INTEGER;
  _taxBaseValue   NUMERIC;
  _test           INTEGER;
  _tmp            INTEGER;

BEGIN

  _aropenid := pId;

  IF (pAmount <= 0) THEN
    RETURN 0;
  END IF;

  _arAccntid := COALESCE(pARAccntid, findARAccount(pCustid));
  _prepaidAccntid := findPrepaidAccount(pCustid);

  _accntid := pAccntid;
  _salescatid := pSalescatid;

  SELECT cust_name INTO _custName
  FROM custinfo
  WHERE (cust_id=pCustid);

  IF EXISTS(SELECT 1 FROM accnt WHERE (accnt_id=_accntid)) THEN
    _prepaidAccntid := _accntid;
  ELSE
    _accntid := -1;
  END IF;

  SELECT accnt_id INTO _tmp
    FROM salescat, accnt
   WHERE ((salescat_prepaid_accnt_id=accnt_id)
     AND  (salescat_id=_salescatid));
  IF (FOUND) THEN
    _accntid := -1;
    _prepaidAccntid := _tmp;
  ELSE
    _salescatid = -1;
  END IF;

  IF(pJournalNumber IS NULL) THEN
    SELECT fetchJournalNumber('AR-MISC') INTO _journalNumber;
  ELSE
    _journalNumber := pJournalNumber;
  END IF;

  _glSequence := fetchGLSequence();

  -- CreatelUpdate aropen for full amount
  IF (_aropenid IS NOT NULL) THEN
    UPDATE aropen SET
      aropen_username=getEffectiveXtUser(), aropen_journalnumber=_journalNumber,
      aropen_cust_id=pCustid, aropen_docnumber=pDocNumber, aropen_doctype='C',
      aropen_ordernumber=pOrderNumber,aropen_docdate=pDocDate, aropen_duedate=_duedate,
      aropen_distdate=pDocDate, aropen_terms_id=pTermsid,
      aropen_salesrep_id=pSalesrepid, aropen_amount=round(pAmount, 2), aropen_paid=0,
      aropen_commission_due=pCommissiondue, aropen_commission_paid=FALSE,
      aropen_applyto='', aropen_ponumber='', aropen_cobmisc_id=-1,
      aropen_open=TRUE, aropen_notes=pNotes, aropen_rsncode_id=pRsncodeid,
      aropen_salescat_id=_salescatid, aropen_accnt_id=_accntid, aropen_curr_id=pCurrId
    WHERE aropen_id = pId;
  ELSE
    SELECT NEXTVAL('aropen_aropen_id_seq') INTO _aropenid;
    INSERT INTO aropen
    ( aropen_id, aropen_username, aropen_journalnumber,
      aropen_cust_id, aropen_docnumber, aropen_doctype, aropen_ordernumber,
      aropen_docdate, aropen_duedate, aropen_distdate, aropen_terms_id, aropen_salesrep_id,
      aropen_amount, aropen_paid, aropen_commission_due, aropen_commission_paid,
      aropen_applyto, aropen_ponumber, aropen_cobmisc_id,
      aropen_open, aropen_notes, aropen_rsncode_id,
      aropen_salescat_id, aropen_accnt_id, aropen_curr_id )
    VALUES
    ( _aropenid, getEffectiveXtUser(), _journalNumber,
      pCustid, pDocNumber, 'C', pOrderNumber,
      pDocDate, _duedate, pDocDate, pTermsid, pSalesrepid,
      round(pAmount, 2), 0, pCommissiondue, FALSE,
      '', '', -1,
      TRUE, pNotes, pRsncodeid,
      _salescatid, _accntid, pCurrId );
  END IF;

  -- Credit the A/R account for the full amount
  SELECT insertIntoGLSeries ( _glSequence, 'A/R', 'CM',
                              pDocNumber, _arAccntid,
                              round(currToBase(pCurrId, pAmount, pDocDate), 2),
                              pDocDate, (_custName || ' ' || pNotes)) INTO _test;

  -- Debit the Tax account for the tax amount
  _taxBaseValue := addTaxToGLSeries(_glSequence,
				      'A/R', 'CM', pDocNumber,
				      pCurrId, pDocDate, pDocDate,
                                      'aropentax', _aropenid,
                                      (_custName || ' ' || pNotes));

  UPDATE aropentax SET taxhist_journalnumber = _journalNumber
  WHERE taxhist_parent_id=_aropenid;

  -- Debit the Prepaid account for the basis amount
  -- Note, _taxBaseValue is negative so it is added to pAmount
  SELECT insertIntoGLSeries ( _glSequence, 'A/R', 'CM',
                              pDocNumber, _prepaidAccntid,
                              round(currToBase(pCurrId, pAmount * -1, pDocDate) + _taxBaseValue * -1, 2),
                              pDocDate, (_custName || ' ' || pNotes)) INTO _test;

  --  Commit the GLSeries;
  SELECT postGLSeries(_glSequence, _journalNumber) INTO _test;
  IF (_test < 0) THEN
    DELETE FROM aropen WHERE (aropen_id=_aropenid);
    PERFORM deleteGLSeries(_glSequence);
    RAISE EXCEPTION 'postGLSeries commit failed with %', _test;
  END IF;

  --  Record Sales History
  INSERT INTO cohist
  ( cohist_cust_id,
   cohist_itemsite_id, cohist_shipto_id,
    cohist_misc_type, cohist_misc_descrip,
    cohist_shipdate, cohist_shipvia,
    cohist_ordernumber, cohist_ponumber, cohist_orderdate,
    cohist_doctype, cohist_invcnumber, cohist_invcdate,
    cohist_qtyshipped, cohist_unitprice, cohist_unitcost,
    cohist_salesrep_id,
    cohist_commission, cohist_commissionpaid,
    cohist_curr_id, cohist_sequence, cohist_cohead_ccpay_id)
  VALUES
  (CASE WHEN pCustid < 0 THEN NULL ELSE pCustid END,
   -1, -1,
    'M', 'A/R Misc Credit Memo',
    pDocDate, '',
    pOrderNumber, '', pDocDate,
    'C', pDocNumber, pDocDate,
    1, (pAmount + _taxBaseValue) * -1, 0, -- taxBaseValue is negative, so we add
    CASE WHEN pSalesrepid < 0 THEN NULL ELSE pSalesrepid END,
    (pCommissiondue * -1.0), FALSE,
    pCurrId, _glSequence, pCoCcpayId)
  RETURNING cohist_id INTO _cohistid;

  INSERT INTO cohisttax
  ( taxhist_parent_id, taxhist_taxtype_id, taxhist_tax_id,
    taxhist_basis, taxhist_basis_tax_id, taxhist_sequence,
    taxhist_percent, taxhist_amount, taxhist_tax,
    taxhist_docdate, taxhist_distdate, taxhist_curr_id, taxhist_curr_rate,
    taxhist_journalnumber )
  SELECT _cohistid, taxhist_taxtype_id, taxhist_tax_id,
         taxhist_basis, taxhist_basis_tax_id, taxhist_sequence,
         taxhist_percent, taxhist_amount, taxhist_tax,
         taxhist_docdate, taxhist_distdate, taxhist_curr_id, taxhist_curr_rate,
         taxhist_journalnumber
  FROM aropentax
  WHERE (taxhist_parent_id=_aropenid);

  RETURN _aropenid;

END;
$$ LANGUAGE 'plpgsql';
