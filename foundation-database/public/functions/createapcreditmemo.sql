CREATE OR REPLACE FUNCTION createAPCreditMemo(INTEGER, TEXT, TEXT, DATE, NUMERIC, TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pVendid ALIAS FOR $1;
  pDocNumber ALIAS FOR $2;
  pPoNumber ALIAS FOR $3;
  pDocDate ALIAS FOR $4;
  pAmount ALIAS FOR $5;
  pNotes ALIAS FOR $6;
  _result INTEGER;

BEGIN

  SELECT createAPCreditMemo( pVendid, fetchJournalNumber('AP-MISC'),
                             pDocNumber, pPoNumber, pDocDate, pAmount, pNotes, -1, pDocDate, -1, baseCurrId() ) INTO _result;

  RETURN _result;

END;
$$ LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION createAPCreditMemo(INTEGER, TEXT, TEXT, DATE, NUMERIC, TEXT, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pVendid ALIAS FOR $1;
  pDocNumber ALIAS FOR $2;
  pPoNumber ALIAS FOR $3;
  pDocDate ALIAS FOR $4;
  pAmount ALIAS FOR $5;
  pNotes ALIAS FOR $6;
  pAccntid ALIAS FOR $7;
  _result INTEGER;

BEGIN

  SELECT createAPCreditMemo( pVendid, fetchJournalNumber('AP-MISC'),
                             pDocNumber, pPoNumber, pDocDate, pAmount, pNotes, pAccntid, pDocDate, -1, baseCurrId() ) INTO _result;

  RETURN _result;

END;
$$ LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION createAPCreditMemo(INTEGER, TEXT, TEXT, DATE, NUMERIC, TEXT, INTEGER, DATE, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pVendid ALIAS FOR $1;
  pDocNumber ALIAS FOR $2;
  pPoNumber ALIAS FOR $3;
  pDocDate ALIAS FOR $4;
  pAmount ALIAS FOR $5;
  pNotes ALIAS FOR $6;
  pAccntid ALIAS FOR $7;
  pDueDate ALIAS FOR $8;
  pTermsid ALIAS FOR $9;
  _result INTEGER;

BEGIN

  SELECT createAPCreditMemo( pVendid, fetchJournalNumber('AP-MISC'),
                             pDocNumber, pPoNumber, pDocDate, pAmount, pNotes, pAccntid, pDueDate, pTermsid, baseCurrId() ) INTO _result;

  RETURN _result;

END;
$$ LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION createAPCreditMemo(INTEGER, INTEGER, TEXT, TEXT, DATE, NUMERIC, TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pVendid ALIAS FOR $1;
  pJournalNumber ALIAS FOR $2;
  pDocNumber ALIAS FOR $3;
  pPoNumber ALIAS FOR $4;
  pDocDate ALIAS FOR $5;
  pAmount ALIAS FOR $6;
  pNotes ALIAS FOR $7;

BEGIN
  RETURN createAPCreditMemo(pVendid, pJournalNumber, pDocNumber, pPoNumber, pDocDate, pAmount, pNotes, -1, pDocDate, -1, baseCurrId() );
END;
$$ LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION createAPCreditMemo(INTEGER, INTEGER, TEXT, TEXT, DATE, NUMERIC, TEXT, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pVendid ALIAS FOR $1;
  pJournalNumber ALIAS FOR $2;
  pDocNumber ALIAS FOR $3;
  pPoNumber ALIAS FOR $4;
  pDocDate ALIAS FOR $5;
  pAmount ALIAS FOR $6;
  pNotes ALIAS FOR $7;
  pAccntid ALIAS FOR $8;
BEGIN
  RETURN createAPCreditMemo( pVendid, pJournalNumber,
                             pDocNumber, pPoNumber, pDocDate, pAmount, pNotes, pAccntid, pDocDate, -1, baseCurrId() );
END;
$$ LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION createAPCreditMemo(INTEGER, INTEGER, TEXT, TEXT, DATE, NUMERIC, TEXT, INTEGER, DATE, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pVendid ALIAS FOR $1;
  pJournalNumber ALIAS FOR $2;
  pDocNumber ALIAS FOR $3;
  pPoNumber ALIAS FOR $4;
  pDocDate ALIAS FOR $5;
  pAmount ALIAS FOR $6;
  pNotes ALIAS FOR $7;
  pAccntid ALIAS FOR $8;
  pDueDate ALIAS FOR $9;
  pTermsid ALIAS FOR $10;
BEGIN
  RETURN createAPCreditMemo( pVendid, pJournalNumber, pDocNumber, pPoNumber, pDocDate, pAmount, pNotes, pAccntid, pDueDate, pTermsid, baseCurrId() );
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION createAPCreditMemo(INTEGER, INTEGER, TEXT, TEXT, DATE, NUMERIC, TEXT, INTEGER, DATE, INTEGER, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pVendid ALIAS FOR $1;
  pJournalNumber ALIAS FOR $2;
  pDocNumber ALIAS FOR $3;
  pPoNumber ALIAS FOR $4;
  pDocDate ALIAS FOR $5;
  pAmount ALIAS FOR $6;
  pNotes ALIAS FOR $7;
  pAccntid ALIAS FOR $8;
  pDueDate ALIAS FOR $9;
  pTermsid ALIAS FOR $10;
  pCurrId ALIAS FOR $11;
BEGIN
  RETURN createAPCreditMemo( NULL, pVendid, pJournalNumber, pDocNumber, pPoNumber, pDocDate, pAmount, pNotes, pAccntid, pDueDate, pTermsid, pCurrId );
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION createAPCreditMemo(INTEGER, INTEGER, INTEGER, TEXT, TEXT, DATE, NUMERIC, TEXT, INTEGER, DATE, INTEGER, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pId ALIAS FOR $1;
  pVendid ALIAS FOR $2;
  pJournalNumber ALIAS FOR $3;
  pDocNumber ALIAS FOR $4;
  pPoNumber ALIAS FOR $5;
  pDocDate ALIAS FOR $6;
  pAmount ALIAS FOR $7;
  pNotes ALIAS FOR $8;
  pAccntid ALIAS FOR $9;
  pDueDate ALIAS FOR $10;
  pTermsid ALIAS FOR $11;
  pCurrId ALIAS FOR $12;
  _vendName TEXT;
  _apAccntid INTEGER;
  _prepaidAccntid INTEGER;
  _accntid INTEGER;
  _glSequence INTEGER;
  _journalNumber INTEGER;
  _apopenid INTEGER;
  _baseAmount NUMERIC;
  _taxBaseValue NUMERIC;
  _test INTEGER;

BEGIN

  _apopenid := pId;

  SELECT findAPAccount(pVendid) INTO _apAccntid;
  SELECT findAPPrepaidAccount(pVendid) INTO _prepaidAccntid;

  SELECT vend_name INTO _vendName
  FROM vendinfo
  WHERE (vend_id=pVendid);
  
  _accntid := pAccntid;

  PERFORM accnt_id
     FROM accnt
    WHERE (accnt_id=_accntid);
  IF (FOUND) THEN
    _prepaidAccntid := _accntid;
  ELSE
    _accntid := -1;
  END IF;

  IF(pJournalNumber IS NULL) THEN
    SELECT fetchJournalNumber('AP-MISC') INTO _journalNumber;
  ELSE
    _journalNumber := pJournalNumber;
  END IF;

  SELECT fetchGLSequence() INTO _glSequence;

  IF (_apopenid IS NOT NULL) THEN
    UPDATE apopen SET
      apopen_username=getEffectiveXtUser(), apopen_journalnumber=_journalNumber,
      apopen_vend_id=pVendid, apopen_docnumber=pDocNumber,
      apopen_doctype='C', apopen_ponumber=pPoNumber,
      apopen_docdate=pDocDate, apopen_duedate=pDueDate,
      apopen_distdate=pDocDate, apopen_terms_id=pTermsid,
      apopen_amount=pAmount, apopen_paid=0,
      apopen_open=(pAmount <> 0), apopen_notes=pNotes,
      apopen_accnt_id=_accntid, apopen_curr_id=pCurrId,
      apopen_closedate=CASE WHEN (pAmount = 0) THEN pDocdate END
    WHERE apopen_id = _apopenid;
  ELSE
    SELECT NEXTVAL('apopen_apopen_id_seq') INTO _apopenid;
    INSERT INTO apopen
    ( apopen_id, apopen_username, apopen_journalnumber,
      apopen_vend_id, apopen_docnumber, apopen_doctype, apopen_ponumber,
      apopen_docdate, apopen_duedate, apopen_distdate, apopen_terms_id,
      apopen_amount, apopen_paid, apopen_open, apopen_notes, apopen_accnt_id, apopen_curr_id,
      apopen_closedate )
    VALUES
    ( _apopenid, getEffectiveXtUser(), _journalNumber,
      pVendid, pDocNumber, 'C', pPoNumber,
      pDocDate, pDueDate, pDocDate, pTermsid,
      pAmount, 0, (pAmount <> 0), pNotes, _accntid, pCurrId,
      CASE WHEN (pAmount = 0) THEN pDocDate END );
  END IF;

  _baseAmount := round(currToBase(pCurrId, pAmount, pDocDate), 2);

  -- Debit the A/P account for the full amount
  SELECT insertIntoGLSeries ( _glSequence, 'A/P', 'CM',
                              pDocNumber, _apAccntid,
                              (_baseAmount * -1),
                              pDocDate, (_vendName || ' ' || pNotes) ) INTO _test;

  -- Credit the Tax account for the tax amount
  _taxBaseValue := addTaxToGLSeries(_glSequence,
				      'A/P', 'CM', pDocNumber,
				      pCurrId, pDocDate, pDocDate,
                                      'apopentax', _apopenid,
                                      _vendName);

  UPDATE apopentax SET taxhist_journalnumber = _journalNumber
  WHERE taxhist_parent_id=_apopenid;

  -- Credit the Prepaid account for the basis amount
  SELECT insertIntoGLSeries ( _glSequence, 'A/P', 'CM',
                              pDocNumber, _prepaidAccntid,
                              (_baseAmount - _taxBaseValue),
                              pDocDate, (_vendName || ' ' || pNotes) ) INTO _test;

  --  Commit the GLSeries;
  SELECT postGLSeries(_glSequence, _journalNumber) INTO _test;
  IF (_test < 0) THEN
    DELETE FROM apopen WHERE (apopen_id=_apopenid);
    PERFORM deleteGLSeries(_glSequence);
    RAISE EXCEPTION 'postGLSeries commit failed with %', _test;
  END IF;

  RETURN pJournalNumber;

END;
$$ LANGUAGE 'plpgsql';
