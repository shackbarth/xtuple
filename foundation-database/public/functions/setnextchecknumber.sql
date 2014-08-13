
CREATE OR REPLACE FUNCTION setNextCheckNumber(pBankaccntid INTEGER,
                                              pNextCheckNumber INTEGER) RETURNS BOOLEAN AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _nextChkNumber INTEGER;
  _checkheadid INTEGER;

BEGIN

  _nextChkNumber := pNextCheckNumber;

  WHILE (TRUE) LOOP
    SELECT checkhead_id INTO _checkheadid
    FROM checkhead
    WHERE (checkhead_number=_nextChkNumber)
      AND (checkhead_bankaccnt_id=pBankaccntid);
    IF (NOT FOUND) THEN
      EXIT;
    ELSE
      _nextChkNumber := _nextChkNumber + 1;
    END IF;
  END LOOP;

  UPDATE bankaccnt
  SET bankaccnt_nextchknum=_nextChkNumber
  WHERE (bankaccnt_id=pBankaccntid);

  RETURN TRUE;

END;
$$ LANGUAGE plpgsql;

