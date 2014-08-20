
CREATE OR REPLACE FUNCTION fetchNextCheckNumber(pBankaccntid INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pBankaccntid ALIAS FOR $1;
  _nextChkNumber INTEGER;
  _checkheadid INTEGER;

BEGIN

  SELECT bankaccnt_nextchknum INTO _nextChkNumber
  FROM bankaccnt
  WHERE (bankaccnt_id=pBankaccntid);

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
  SET bankaccnt_nextchknum = (bankaccnt_nextchknum + 1)
  WHERE (bankaccnt_id=pBankaccntid);

  RETURN _nextChkNumber;

END;
$$ LANGUAGE plpgsql;

