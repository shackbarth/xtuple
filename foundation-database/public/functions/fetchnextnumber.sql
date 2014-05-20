CREATE OR REPLACE FUNCTION fetchNextNumber(TEXT) RETURNS TEXT AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  psequence	ALIAS FOR $1;
  _number	TEXT;
  _numcol	TEXT;
  _select	TEXT;
  _table	TEXT;
  _test		TEXT;
  _nextnum	INTEGER;
  _seqiss       seqiss;
  __seqiss      seqiss[];
  _not_issued       BOOLEAN;

BEGIN
  SELECT CAST(orderseq_number AS text), orderseq_number, orderseq_table, orderseq_numcol, COALESCE(orderseq_seqiss, ARRAY[]::seqiss[])
    INTO _number, _nextnum, _table, _numcol, __seqiss
  FROM orderseq
  WHERE (orderseq_name=psequence) FOR UPDATE;

  IF (NOT FOUND) THEN
    RAISE EXCEPTION 'Invalid orderseq_name %', psequence;
  END IF;
  
  LOOP

    _seqiss := (_nextnum, now());

    SELECT count(*) = 0 INTO _not_issued
    FROM (SELECT UNNEST(__seqiss) AS issued) data
    WHERE (issued).seqiss_number = _nextnum;

    _nextnum := _nextnum + 1;

    -- Test if the number has been issued, but not committed
    IF (_not_issued) THEN

      -- Test if the number has been committed
      _select := 'SELECT ' || quote_ident(_numcol) ||
	         ' FROM '  || _table ||
	         ' WHERE (' || quote_ident(_numcol) || '=' ||
                 quote_literal(_number) || ');';

      EXECUTE _select INTO _test;

      IF (_test IS NULL OR NOT FOUND) THEN
        EXIT;
      END IF;

    END IF;

    -- Number in use, try again
    _number = _nextnum::text;

  END LOOP;

  UPDATE orderseq SET 
    orderseq_number = _nextnum
  WHERE (orderseq_name=psequence);

  IF (fetchMetricBool('EnableGaplessNumbering')) THEN
    UPDATE orderseq SET 
      orderseq_seqiss = orderseq_seqiss || _seqiss
    WHERE (orderseq_name=psequence);
  END IF;

  RETURN _number;

END;
$$ LANGUAGE 'plpgsql';
