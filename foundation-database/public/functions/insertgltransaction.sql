
CREATE OR REPLACE FUNCTION insertGLTransaction(TEXT, TEXT, TEXT, TEXT, INTEGER, INTEGER, INTEGER, NUMERIC(12,2), DATE) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pSource ALIAS FOR $1;
  pDocType ALIAS FOR $2;
  pDocNumber ALIAS FOR $3;
  pNotes ALIAS FOR $4;
  pCreditid ALIAS FOR $5;
  pDebitid ALIAS FOR $6;
  pMiscid ALIAS FOR $7;
  pAmount ALIAS FOR $8;
  pDistDate ALIAS FOR $9;
  _return INTEGER;

BEGIN

  SELECT insertGLTransaction( fetchJournalNumber('GL-MISC'),
                              pSource, pDocType, pDocNumber, pNotes,
                              pCreditid, pDebitid, pMiscid, pAmount, pDistDate) INTO _return;

  RETURN _return;

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION insertGLTransaction(TEXT, TEXT, TEXT, TEXT, INTEGER, INTEGER, INTEGER, NUMERIC(12,2), DATE, BOOLEAN) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pSource ALIAS FOR $1;
  pDocType ALIAS FOR $2;
  pDocNumber ALIAS FOR $3;
  pNotes ALIAS FOR $4;
  pCreditid ALIAS FOR $5;
  pDebitid ALIAS FOR $6;
  pMiscid ALIAS FOR $7;
  pAmount ALIAS FOR $8;
  pDistDate ALIAS FOR $9;
  pPostTrialBal ALIAS FOR $10;
  _return INTEGER;

BEGIN

  SELECT insertGLTransaction( fetchJournalNumber('GL-MISC'),
                              pSource, pDocType, pDocNumber, pNotes,
                              pCreditid, pDebitid, pMiscid, pAmount, pDistDate, pPostTrialBal) INTO _return;

  RETURN _return;

END;
$$ LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION insertGLTransaction(INTEGER, TEXT, TEXT, TEXT, TEXT, INTEGER, INTEGER, INTEGER, NUMERIC(12,2), DATE) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pJournalNumber ALIAS FOR $1;
  pSource ALIAS FOR $2;
  pDocType ALIAS FOR $3;
  pDocNumber ALIAS FOR $4;
  pNotes ALIAS FOR $5;
  pCreditid ALIAS FOR $6;
  pDebitid ALIAS FOR $7;
  pMiscid ALIAS FOR $8;
  pAmount ALIAS FOR $9;
  pDistDate ALIAS FOR $10;
  _return INTEGER;

BEGIN

  SELECT insertGLTransaction( pJournalNumber, pSource, pDocType, pDocNumber, pNotes,
                              pCreditid, pDebitid, pMiscid, pAmount, pDistDate, TRUE) INTO _return;

  RETURN _return;

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION insertGLTransaction(INTEGER, TEXT, TEXT, TEXT, TEXT, INTEGER, INTEGER, INTEGER, NUMERIC(12,2), DATE, BOOLEAN) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pJournalNumber ALIAS FOR $1;
  pSource ALIAS FOR $2;
  pDocType ALIAS FOR $3;
  pDocNumber ALIAS FOR $4;
  pNotes ALIAS FOR $5;
  pCreditid ALIAS FOR $6;
  pDebitid ALIAS FOR $7;
  pMiscid ALIAS FOR $8;
  pAmount ALIAS FOR $9;
  pDistDate ALIAS FOR $10;
  pPostTrialBal ALIAS FOR $11;
  
  _return INTEGER;

BEGIN

  SELECT insertGLTransaction( pJournalNumber, pSource, pDocType, pDocNumber, pNotes,
                              pCreditid, pDebitid, pMiscid, pAmount, pDistDate, pPostTrialBal, false) INTO _return;

  RETURN _return;

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION insertGLTransaction(INTEGER, TEXT, TEXT, TEXT, TEXT, INTEGER, INTEGER, INTEGER, NUMERIC(12,2), DATE, BOOLEAN, BOOLEAN) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pJournalNumber ALIAS FOR $1;
  pSource ALIAS FOR $2;
  pDocType ALIAS FOR $3;
  pDocNumber ALIAS FOR $4;
  pNotes ALIAS FOR $5;
  pCreditid ALIAS FOR $6;
  pDebitid ALIAS FOR $7;
  pMiscid ALIAS FOR $8;
  pAmount ALIAS FOR $9;
  pDistDate ALIAS FOR $10;
  pPostTrialBal ALIAS FOR $11;
  pOnlyGL ALIAS FOR $12;
  _debitid INTEGER;
  _creditid INTEGER;
  _sequence INTEGER;
  _check INTEGER;

BEGIN

--  Check GL Interface metric
  IF (fetchMetricBool('InterfaceToGL') = false AND pSource IN ('I/M', 'P/D', 'S/R', 'W/O')) THEN
    RETURN 0;
  END IF;
  IF (fetchMetricBool('InterfaceAPToGL') = false AND pSource = 'A/P') THEN
    RETURN 0;
  END IF;
  IF (fetchMetricBool('InterfaceARToGL') = false AND pSource IN ('A/R', 'S/O', 'S/R')) THEN
    RETURN 0;
  END IF;

--  Is there anything to post?
--  ToDo - 2 should really be the scale of the base currency
  IF (round(pAmount, 2) = 0) THEN
    RETURN -3;
  END IF;

/*  Make sure we don't create an imbalance across companies.
    The 'IgnoreCompanyBalance' metric is a back door mechanism to
    allow legacy users to create transactions accross companies if
    they have been using the company segment for something else
    and they MUST continue to be able to do so.  It can only be 
    implemented by direct sql update to the metric table and should 
    otherwise be discouraged.
*/ 
  IF (COALESCE(fetchMetricValue('GLCompanySize'),0) > 0 
    AND fetchMetricBool('IgnoreCompany') = false)  THEN

    IF (SELECT (COALESCE(d.accnt_company,'') != COALESCE(c.accnt_company,''))
       FROM accnt d, accnt c
       WHERE ((d.accnt_id=pDebitid)
        AND (c.accnt_id=pCreditid))) THEN
      RAISE EXCEPTION 'G/L Transaction can not be posted because accounts % and % reference two differnt companies.',
        formatGlaccount(pDebitid), formatGlaccount(pCreditid);
    END IF;
  END IF;

--  Validate pDebitid
  IF (pDebitid IN (SELECT accnt_id FROM accnt)) THEN
    _debitid := pDebitid;
  ELSE
    SELECT getUnassignedAccntId() INTO _debitid;
  END IF;

--  Validate pCreditid
  IF (pCreditid IN (SELECT accnt_id FROM accnt)) THEN
    _creditid := pCreditid;
  ELSE
    SELECT getUnassignedAccntId() INTO _creditid;
  END IF;

-- refuse to accept postings into closed periods
  IF (SELECT BOOL_AND(COALESCE(period_closed, FALSE))
      FROM accnt LEFT OUTER JOIN
           period ON (pDistDate BETWEEN period_start AND period_end)
      WHERE (accnt_id IN (_creditid, _debitid))) THEN
    RAISE EXCEPTION 'Cannot post to closed period (%).', pDistDate;
    RETURN -4;  -- remove raise exception when all callers check return code
  END IF;

-- refuse to accept postings into frozen periods without proper priv
  IF (SELECT NOT BOOL_AND(checkPrivilege('PostFrozenPeriod')) AND
             BOOL_AND(COALESCE(period_freeze, FALSE))
      FROM accnt LEFT OUTER JOIN
           period ON (pDistDate BETWEEN period_start AND period_end)
      WHERE (accnt_id IN (_creditid, _debitid))) THEN
    RAISE EXCEPTION 'Cannot post to frozen period (%).', pDistDate;
    RETURN -4;  -- remove raise exception when all callers check return code
  END IF;

-- refuse to accept postings into nonexistent periods
  IF NOT EXISTS(SELECT period_id
                FROM period
                WHERE (pDistDate BETWEEN period_start AND period_end)) THEN
    RAISE EXCEPTION 'Cannot post to nonexistent period (%).', pDistDate;
  END IF;

--  Grab a sequence for the pair
  SELECT fetchGLSequence() INTO _sequence;

  IF (NOT pOnlyGL AND fetchMetricBool('UseJournals')) THEN
  --  First the credit	
    INSERT INTO sltrans
    ( sltrans_journalnumber, sltrans_posted, sltrans_created, sltrans_date,
      sltrans_sequence, sltrans_accnt_id, sltrans_source,
      sltrans_doctype, sltrans_docnumber, sltrans_notes,
      sltrans_misc_id, sltrans_amount )
    VALUES
    ( pJournalNumber, FALSE, CURRENT_TIMESTAMP, pDistDate,
      _sequence, _creditid, pSource,
      pDocType, pDocNumber, pNotes,
      pMiscid, pAmount );

  --  Now the debit
    INSERT INTO sltrans
    ( sltrans_journalnumber, sltrans_posted, sltrans_created, sltrans_date,
      sltrans_sequence, sltrans_accnt_id, sltrans_source,
      sltrans_doctype, sltrans_docnumber, sltrans_notes,
      sltrans_misc_id, sltrans_amount )
    VALUES
    ( pJournalNumber, FALSE, CURRENT_TIMESTAMP, pDistDate,
      _sequence, _debitid, pSource,
      pDocType, pDocNumber, pNotes,
      pMiscid, (pAmount * -1) );
  ELSE
  --  First the credit
    INSERT INTO gltrans
    ( gltrans_journalnumber, gltrans_posted, gltrans_exported, gltrans_created, gltrans_date,
      gltrans_sequence, gltrans_accnt_id, gltrans_source,
      gltrans_doctype, gltrans_docnumber, gltrans_notes,
      gltrans_misc_id, gltrans_amount )
    VALUES
    ( pJournalNumber, FALSE, FALSE, CURRENT_TIMESTAMP, pDistDate,
      _sequence, _creditid, pSource,
      pDocType, pDocNumber, pNotes,
      pMiscid, pAmount );

  --  Now the debit
    INSERT INTO gltrans
    ( gltrans_journalnumber, gltrans_posted, gltrans_exported, gltrans_created, gltrans_date,
      gltrans_sequence, gltrans_accnt_id, gltrans_source,
      gltrans_doctype, gltrans_docnumber, gltrans_notes,
      gltrans_misc_id, gltrans_amount )
    VALUES
    ( pJournalNumber, FALSE, FALSE, CURRENT_TIMESTAMP, pDistDate,
      _sequence, _debitid, pSource,
      pDocType, pDocNumber, pNotes,
      pMiscid, (pAmount * -1) );

    IF (pPostTrialBal) THEN
      PERFORM postIntoTrialBalance(_sequence);
    END IF;
  END IF;

  RETURN _sequence;

END;
$$ LANGUAGE 'plpgsql';

