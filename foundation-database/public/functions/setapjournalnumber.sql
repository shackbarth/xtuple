CREATE OR REPLACE FUNCTION setApJournalNumber() RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _journalNumber INTEGER;
  _r RECORD;

BEGIN

--  Fetch the next Journal Number
  SELECT fetchJournalNumber(''A/P'') INTO _journalNumber;

--  Walk through all of the A/P Open Items
  FOR _r IN SELECT apopen_id, apopen_docnumber
            FROM apopen
            WHERE (NOT apopen_posted) LOOP

--  Set the Journal Number for all of the G/L Transactions
--  for the A/P Open Item
    UPDATE gltrans
    SET gltrans_journalnumber=_journalNumber
    WHERE ( (gltrans_source=''P/O'')
     AND (gltrans_doctype IN (''VO''))
     AND (gltrans_docnumber=_r.apopen_docnumber)
     AND (NOT gltrans_exported) );

--  Set the Journal Number for the A/P Open Item
    UPDATE apopen
    SET apopen_journalnumber=_journalNumber
    WHERE (apopen_id=_r.apopen_id);

  END LOOP;

  RETURN _journalNumber;

END;
' LANGUAGE 'plpgsql';
