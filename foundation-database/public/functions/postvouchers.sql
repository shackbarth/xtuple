CREATE OR REPLACE FUNCTION postVouchers(BOOLEAN) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pPostCosts ALIAS FOR $1;
  _journalNumber INTEGER;

BEGIN

  SELECT fetchJournalNumber('AP-VO') INTO _journalNumber;

  PERFORM postVoucher(vohead_id, _journalNumber, pPostCosts)
  FROM vohead
  WHERE (NOT vohead_posted);

  RETURN _journalNumber;

END;
$$ LANGUAGE 'plpgsql';
