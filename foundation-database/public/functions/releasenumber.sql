CREATE OR REPLACE FUNCTION releaseNumber(psequence TEXT,
                                         pnumber INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _isManual     BOOLEAN;
  _test		INTEGER;
  _number	TEXT;
  _table	TEXT;
  _numcol	TEXT;

BEGIN
  IF (fetchMetricBool('EnableGaplessNumbering')) THEN
    -- drop the number back into the pool if it was not committed
    PERFORM clearNumberIssue(psequence, pnumber);
  
    UPDATE orderseq SET
      orderseq_number = LEAST(pnumber, orderseq_number)
    WHERE (orderseq_name=psequence);
  ELSE
    -- get the current state of the sequence
    SELECT orderseq_number, orderseq_table, orderseq_numcol
        INTO _number, _table, _numcol
    FROM orderseq
    WHERE (orderseq_name=psequence);
    IF (NOT FOUND) THEN
      RAISE EXCEPTION 'Invalid orderseq_name %', psequence;
    END IF;

    -- check if an order exists with the given order number
    EXECUTE 'SELECT ' || quote_ident(_numcol) ||
            ' FROM '  || _table ||
            ' WHERE (' || quote_ident(_numcol) || '=' ||
            quote_literal(_number) || ');'
    INTO _test;

    -- check if order seq has been incremented past the given order number
    -- S/O code reads: IF ((_test - 1) <> pSoNumber) THEN
    -- but the following /should/ address bug 4020 (can't reproduce it to test)
    IF (FOUND AND ((_test - 1) > pnumber)) THEN
      RETURN 0;
    END IF;

    SELECT metric_value = 'M' INTO _isManual
    FROM metric
    WHERE (metric_name = CASE WHEN psequence='CmNumber' THEN 'CMNumberGeneration'
                              WHEN psequence='SoNumber' THEN 'CONumberGeneration'
                              WHEN psequence='InvcNumber' THEN 'InvcNumberGeneration'
                              WHEN psequence='PoNumber' THEN 'PONumberGeneration'
                              WHEN psequence='PrNumber' THEN 'PrNumberGeneration'
                              WHEN psequence='QuNumber' THEN 'QUNumberGeneration'
                              WHEN psequence='RaNumber' THEN 'RANumberGeneration'
                         --   WHEN psequence='??Number' THEN 'ShipmentNumberGeneration'
                              WHEN psequence='ToNumber' THEN 'TONumberGeneration'
                              WHEN psequence='VcNumber' THEN 'VoucherNumberGeneration'
                              WHEN psequence='WoNumber' THEN 'WONumberGeneration'
                              ELSE NULL
                         END);

    -- release the given order number for reuse
    IF (NOT FOUND OR NOT _isManual) THEN
      UPDATE orderseq
      SET orderseq_number = (orderseq_number - 1)
      WHERE (orderseq_name=psequence);
    ELSE
      RAISE NOTICE 'cannot update orderseq';
    END IF;
  END IF;

  RETURN 1;
END;
$$ LANGUAGE plpgsql;
