CREATE OR REPLACE FUNCTION createCheck(INTEGER, TEXT, INTEGER, DATE, NUMERIC, INTEGER, INTEGER, INTEGER, TEXT, TEXT, BOOL) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pBankaccntid		ALIAS FOR  $1;
  pRecipType		ALIAS FOR  $2;
  pRecipId		ALIAS FOR  $3;
  pCheckDate		ALIAS FOR  $4;
  pAmount		ALIAS FOR  $5;
  pCurrid		ALIAS FOR  $6;
  pExpcatid		ALIAS FOR  $7;
  _journalNumber	INTEGER := $8;
  pFor			ALIAS FOR  $9;
  pNotes		ALIAS FOR $10;
  pMisc			ALIAS FOR $11;
  _checkid INTEGER;
BEGIN

  SELECT createCheck(pBankaccntid,pRecipType,pRecipId,pCheckDate,pAmount,pCurrid,pExpcatid,_journalNumber,pFor,pNotes,pMisc,NULL) INTO _checkid;
  RETURN _checkid;

END;
$$ LANGUAGE 'plpgsql';



CREATE OR REPLACE FUNCTION createCheck(INTEGER, TEXT, INTEGER, DATE, NUMERIC, INTEGER, INTEGER, INTEGER, TEXT, TEXT, BOOL, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pBankaccntid		ALIAS FOR  $1;
  pRecipType		ALIAS FOR  $2;
  pRecipId		ALIAS FOR  $3;
  pCheckDate		ALIAS FOR  $4;
  pAmount		ALIAS FOR  $5;
  pCurrid		ALIAS FOR  $6;
  pExpcatid		ALIAS FOR  $7;
  _journalNumber	INTEGER := $8;
  pFor			ALIAS FOR  $9;
  pNotes		ALIAS FOR $10;
  pMisc			ALIAS FOR $11;
  pAropenid             ALIAS FOR $12;
  _checkid		INTEGER;
  _check_curr_rate      NUMERIC;
  _bankaccnt_currid	INTEGER;

BEGIN
  SELECT bankaccnt_curr_id,currRate(bankaccnt_curr_id,pCheckDate) INTO _bankaccnt_currid, _check_curr_rate
  FROM bankaccnt
  WHERE bankaccnt_id = pBankaccntid;
  IF (NOT FOUND) THEN
    RETURN -1;
  END IF;

  IF (pRecipType NOT IN ('C', 'T', 'V')) THEN
    RETURN -2;
  END IF;

  IF (pCheckDate IS NULL) THEN
    RETURN -3;
  END IF;

  IF (pAmount <= 0) THEN
    RETURN -4;
  END IF;

  IF (pCurrid IS NULL
      OR NOT EXISTS(SELECT * FROM curr_symbol WHERE (curr_id=pCurrid))) THEN
    RETURN -5;
  END IF;

  IF (pExpcatid IS NOT NULL
      AND NOT EXISTS(SELECT * FROM expcat WHERE (expcat_id=pExpcatid))) THEN
    RETURN -6;
  END IF;

-- Do not assign Journal Number until check is posted
--  if (_journalNumber IS NULL) THEN
--    _journalNumber := fetchJournalNumber('AP-CK');
--  END IF;

  _checkid := NEXTVAL('checkhead_checkhead_id_seq');

  INSERT INTO checkhead
  ( checkhead_id,		checkhead_recip_type,	checkhead_recip_id,
    checkhead_bankaccnt_id,	checkhead_number,
    checkhead_amount,
    checkhead_checkdate,	checkhead_misc,		checkhead_expcat_id,
    checkhead_journalnumber,	checkhead_for,		checkhead_notes,
    checkhead_curr_id )
  VALUES
  ( _checkid,			pRecipType,		pRecipId,
    pBankaccntid,		-1, --fetchNextCheckNumber(pBankaccntid),
    currToCurr(pCurrid, _bankaccnt_currid, pAmount, pCheckDate),
    pCheckDate,			COALESCE(pMisc, FALSE),	pExpcatid,
    _journalNumber,		pFor,			pNotes,
    _bankaccnt_currid );

  IF (pAropenid IS NOT NULL AND fetchmetricbool('EnableReturnAuth')) THEN
    INSERT INTO checkitem (checkitem_checkhead_id,checkitem_amount,checkitem_discount,checkitem_ponumber,
                           checkitem_aropen_id,checkitem_docdate,checkitem_curr_id,checkitem_cmnumber,
                           checkitem_ranumber, checkitem_curr_rate)
    SELECT _checkid, currToCurr(checkhead_curr_id, aropen_curr_id, pAmount, checkhead_checkdate),
      0,cmhead_custponumber,pAropenid,aropen_docdate,aropen_curr_id,cmhead_number,rahead_number,
      1 / (_check_curr_rate / aropen_curr_rate)
    FROM checkhead, aropen
      LEFT OUTER JOIN cmhead ON (aropen_docnumber=cmhead_number)
      LEFT OUTER JOIN rahead ON (cmhead_rahead_id=rahead_id)
    WHERE ((aropen_id=pAropenid)
     AND (checkhead_id=_checkid));
  ELSIF (pAropenid IS NOT NULL) THEN
    INSERT INTO checkitem (checkitem_checkhead_id,checkitem_amount,checkitem_discount,checkitem_ponumber,
                           checkitem_aropen_id,checkitem_docdate,checkitem_curr_id,checkitem_cmnumber,
                           checkitem_ranumber, checkitem_curr_rate)
    SELECT _checkid,currToCurr(checkhead_curr_id, aropen_curr_id, pAmount, checkhead_checkdate),
      0,cmhead_custponumber,pAropenid,aropen_docdate,aropen_curr_id,cmhead_number,NULL,
      1 / (_check_curr_rate / aropen_curr_rate)
    FROM checkhead, aropen
      LEFT OUTER JOIN cmhead ON (aropen_docnumber=cmhead_number)
    WHERE ((aropen_id=pAropenid)
     AND (checkhead_id=_checkid));
  END IF;
  

  RETURN _checkid;

END;
$$ LANGUAGE 'plpgsql';
