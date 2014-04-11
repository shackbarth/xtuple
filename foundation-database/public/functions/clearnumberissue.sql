CREATE OR REPLACE FUNCTION clearNumberIssue(psequence TEXT, pnumber INTEGER) RETURNS BOOLEAN AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  __seqiss	seqiss[];
  __newiss	seqiss[] := ARRAY[]::seqiss[];
  _i		INTEGER;
  _result	BOOLEAN := FALSE;
  _interval	TEXT := fetchMetricText('NumberIssueResetIntervalDays') || ' day';
  _number	INTEGER;
BEGIN
  -- get the sequence to update
  SELECT orderseq_seqiss INTO __seqiss
  FROM orderseq
  WHERE (orderseq_name=psequence);

  IF (NOT FOUND) THEN
    RAISE EXCEPTION 'Invalid orderseq_name %', psequence;
  END IF;

  IF(ARRAY_LENGTH(COALESCE(__seqiss,__newiss),1) IS NULL) THEN
    RETURN FALSE;
  END IF;

  -- build a new array sans the number we are releasing
  FOR _i IN 1..ARRAY_LENGTH(__seqiss,1)
  LOOP
    IF((__seqiss[_i]).seqiss_number = pnumber) THEN
      _result = TRUE;
    -- don't bother re-adding stale numbers
    ELSIF (now() - _interval::INTERVAL > (__seqiss[_i]).seqiss_time) THEN
      IF (_number IS NULL) THEN
        _number := (__seqiss[_i]).seqiss_number;
      ELSE 
        _number := LEAST((__seqiss[_i]).seqiss_number, _number);
      END IF;
    ELSE
      __newiss := __newiss || __seqiss[_i];
    END IF;
  END LOOP;

  -- update the order sequence with the result
  UPDATE orderseq SET
    orderseq_seqiss = __newiss
  WHERE (orderseq_name=psequence);

  -- reset to any cleared stale number
  IF(_number IS NOT NULL) THEN
    UPDATE orderseq SET
      orderseq_number = _number
    WHERE (orderseq_name=psequence);
  END IF;
  
  RETURN _result;
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION clearNumberIssue(psequence TEXT, pnumber TEXT) RETURNS BOOLEAN AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _castpnumber  INTEGER;
BEGIN
  -- for now, order numbers in the database are text but usually
  -- string representations of integers. allow for the occasional non-integer.
  BEGIN
    _castpnumber  := CAST(pnumber AS INTEGER);
  EXCEPTION WHEN cannot_coerce OR
                 invalid_text_representation
  THEN
    RAISE DEBUG 'clearNumberIssue(%, %) received an unexpected pnumber',
                  psequence, pnumber;
    RETURN FALSE;
  END;

  RETURN clearNumberIssue(psequence, _castpnumber);
END;
$$ LANGUAGE 'plpgsql';
