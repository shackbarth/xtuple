
CREATE OR REPLACE FUNCTION setGlJournalNumber(DATE, DATE) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pStartDate ALIAS FOR $1;
  pEndDate ALIAS FOR $2;
  _journalNumber INTEGER;

BEGIN

--  Fetch the next Journal Number
  SELECT fetchJournalNumber(''G/L'') INTO _journalNumber;

--  Set the Journal Number for all of the unposted G/L Transactions
--  in the passed date range.
  UPDATE gltrans
  SET gltrans_journalnumber=_journalNumber
  WHERE ( (NOT gltrans_exported)
    AND (gltrans_date BETWEEN pStartDate and pEndDate) );

  RETURN _journalNumber;

END;
' LANGUAGE 'plpgsql';

