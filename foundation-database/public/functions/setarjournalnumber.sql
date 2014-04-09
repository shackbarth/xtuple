
CREATE OR REPLACE FUNCTION setArJournalNumber() RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _journalNumber INTEGER;
  _r RECORD;

BEGIN

--  Fetch the next Journal Number
  SELECT fetchJournalNumber(''A/R'') INTO _journalNumber;

--  Walk through all of the A/R Open Items
  FOR _r IN SELECT aropen_id, aropen_docnumber
            FROM aropen
            WHERE (NOT aropen_posted) LOOP

--  Set the Journal Number for all of the G/L Transactions
--  for the A/R Open Item
    UPDATE gltrans
    SET gltrans_journalnumber=_journalNumber
    WHERE ( (gltrans_source=''S/O'')
     AND (gltrans_doctype IN (''CM'', ''IN''))
     AND (gltrans_docnumber=_r.aropen_docnumber)
     AND (NOT gltrans_exported) );

--  Set the Journal Number for the A/R Open Item
    UPDATE aropen
    SET aropen_journalnumber=_journalNumber
    WHERE (aropen_id=_r.aropen_id);

  END LOOP;

  RETURN _journalNumber;

END;
' LANGUAGE 'plpgsql';

