
CREATE OR REPLACE FUNCTION closeAccountingPeriod(INTEGER) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pPeriodid ALIAS FOR $1;
  _r RECORD;
  _nextPeriodid INTEGER;
  _trialbalid INTEGER;
  _ending NUMERIC;
  _currYear INTEGER;
  _nextYear INTEGER;
BEGIN

--  Bypass error checking is this the the initial period
  IF ( NOT ( SELECT period_initial
             FROM period
             WHERE (period_id=pPeriodid) ) ) THEN

--  Check to make use that the period is not already closed
    IF ( ( SELECT period_closed
           FROM period
           WHERE (period_id=pPeriodid) ) ) THEN
      RETURN -1;
    END IF;

--  Make sure that the day before this period belongs to another period
    SELECT prev.period_id AS periodid, prev.period_closed AS closed INTO _r
    FROM period AS prev, period AS curr
    WHERE ( (prev.period_end = (curr.period_start - 1))
     AND (curr.period_id=pPeriodid) );
    IF (NOT FOUND) THEN
      RETURN -2;
    END IF;

--  Make sure that the previous period is closed
    IF (NOT _r.closed) THEN
      RETURN -3;
    END IF;

  END IF;

--  Make sure that there the next period is defined
  SELECT next.period_id INTO _nextPeriodid
  FROM period AS next, period AS curr
  WHERE ( (next.period_start = (curr.period_end + 1))
   AND (curr.period_id=pPeriodid) );
  IF (NOT FOUND) THEN
    RETURN -4;
  END IF;

--  Make sure that the user is not trying to prematurely close the Period
  IF ( ( SELECT (period_end >= CURRENT_DATE)
         FROM period
         WHERE (period_id=pPeriodid) ) ) THEN
    RETURN -5;
  END IF;

  SELECT yearperiod_id INTO _currYear
    FROM yearperiod, period
   WHERE ((period_end BETWEEN yearperiod_start and yearperiod_end)
     AND  (period_id=pPeriodid));
  IF (NOT FOUND) THEN
    _currYear := -1;
  END IF;

  SELECT yearperiod_id INTO _nextYear
    FROM yearperiod, period
   WHERE ((period_end BETWEEN yearperiod_start and yearperiod_end)
     AND  (period_id=_nextPeriodid));
  IF (NOT FOUND) THEN
    RETURN -6;
  END IF;

--  Walk through the entire COA, calculating the ending balance and pushing
--  it to the beginning balance for the next period
  FOR _r IN SELECT accnt_id, accnt_type IN (''E'', ''R'') AS revexp,
                   trialbal_id, trialbal_beginning,
                   trialbal_credits, trialbal_debits
            FROM accnt LEFT OUTER JOIN trialbal ON ( (trialbal_accnt_id=accnt_id) AND (trialbal_period_id=pPeriodid) )
            ORDER BY accnt_id LOOP
    IF (_r.trialbal_id IS NULL) THEN
      _ending = 0;

      INSERT INTO trialbal
      ( trialbal_period_id, trialbal_accnt_id,
        trialbal_beginning, trialbal_ending, trialbal_dirty,
        trialbal_credits, trialbal_debits )
      VALUES
      ( pPeriodid, _r.accnt_id,
        0, 0, FALSE,
        0, 0 );
    ELSE
      _ending = (_r.trialbal_beginning - _r.trialbal_debits + _r.trialbal_credits);

      UPDATE trialbal
      SET trialbal_ending=_ending,
          trialbal_dirty = FALSE
      WHERE (trialbal_id=_r.trialbal_id);

      PERFORM forwardUpdateTrialBalance(_r.trialbal_id);
    END IF;

    IF (_r.revexp AND _currYear != _nextYear) THEN
      _ending := 0;
    END IF;

--  Find the trialbal record for the next period
    SELECT trialbal_id INTO _trialbalid
    FROM trialbal
    WHERE ( (trialbal_period_id=_nextPeriodid)
     AND (trialbal_accnt_id=_r.accnt_id) );
    IF (FOUND) THEN
      UPDATE trialbal
      SET trialbal_beginning = (_ending + trialbal_yearend),
          trialbal_ending = (_ending + trialbal_yearend - trialbal_debits + trialbal_credits)
      WHERE (trialbal_id=_trialbalid);
    ELSE
      INSERT INTO trialbal
      ( trialbal_period_id, trialbal_accnt_id,
        trialbal_beginning, trialbal_ending, trialbal_dirty,
        trialbal_credits, trialbal_debits )
      VALUES(_nextPeriodid, _r.accnt_id,
             _ending, _ending, TRUE,
             0, 0 );
    END IF;

  END LOOP;

--  Set the period_closed flag
  UPDATE period
  SET period_closed=TRUE
  WHERE (period_id=pPeriodid);

  RETURN pPeriodid;

END;
' LANGUAGE 'plpgsql';

