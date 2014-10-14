CREATE OR REPLACE FUNCTION postchecks(INTEGER)
  RETURNS integer AS
$BODY$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pBankaccntid ALIAS FOR $1;
  _journalNumber INTEGER;

BEGIN

  SELECT fetchJournalNumber('AP-CK') INTO _journalNumber;

  PERFORM postCheck(checkhead_id, _journalNumber)
  FROM checkhead
  JOIN bankaccnt ON (bankaccnt_id=checkhead_bankaccnt_id)
  WHERE ( (NOT checkhead_void)
    AND   (NOT checkhead_posted)
    AND   CASE WHEN (bankaccnt_prnt_check) THEN (checkhead_printed) ELSE 1=1 END
    AND   (checkhead_bankaccnt_id=pBankaccntid) );

  RETURN _journalNumber;

END;
$BODY$
  LANGUAGE plpgsql;
