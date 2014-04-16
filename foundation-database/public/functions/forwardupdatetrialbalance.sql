
CREATE OR REPLACE FUNCTION forwardUpdateTrialBalance(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pTrialbalid ALIAS FOR $1;
  _p RECORD;
  _r RECORD;
  _ending NUMERIC;
  _prevYear INTEGER;
  _currYear INTEGER;
  _prevYearClosed BOOLEAN;
  _currYearClosed BOOLEAN;
  _result INTEGER;

BEGIN

  SELECT trialbal_accnt_id, trialbal_ending,
         yearperiod_id, yearperiod_closed,
         period_end, accnt_type IN ('E', 'R') AS revexp INTO _p
  FROM trialbal, period, yearperiod, accnt
  WHERE ( (trialbal_period_id=period_id)
   AND (yearperiod_id=period_yearperiod_id)
   AND (trialbal_accnt_id=accnt_id)
   AND (trialbal_id=pTrialbalid) );

  _ending = _p.trialbal_ending;

  SELECT yearperiod_id, yearperiod_closed INTO _prevYear, _prevYearClosed
    FROM yearperiod
   WHERE (_p.period_end BETWEEN yearperiod_start AND yearperiod_end);
  IF (NOT FOUND) THEN
    _prevYear := -1;
    _prevYearClosed := false;
  END IF;

--  Find all of the subsequent periods and their trialbal, if they exist
  FOR _r IN SELECT period_id, period_end,
                   trialbal_id, trialbal_debits, trialbal_credits,
                   trialbal_yearend
            FROM period LEFT OUTER JOIN trialbal
                 ON ( (trialbal_period_id=period_id) AND (trialbal_accnt_id=_p.trialbal_accnt_id) )
            WHERE (period_start > _p.period_end)
            ORDER BY period_start LOOP

    SELECT yearperiod_id, yearperiod_closed INTO _currYear, _currYearClosed
      FROM yearperiod
     WHERE (_r.period_end BETWEEN yearperiod_start AND yearperiod_end);
    IF (NOT FOUND) THEN
      _currYear := -1;
      _currYearClosed := false;
    END IF;

    IF (_p.revexp AND _currYear != _prevYear) THEN
      _ending := 0;
      IF (_prevYearClosed) THEN
        SELECT updateRetainedEarnings(_prevYear) INTO _result;
        IF (_result < 0) THEN
          RETURN _result;
        END IF;
      END IF;
    END IF;

    _prevYear := _currYear;
    _prevYearClosed := _currYearClosed;

    IF (_r.trialbal_id IS NULL) THEN
      -- SELECT SUM(gltrans_amount) INTO _glAmount
       -- FROM gltrans
       -- WHERE ( (gltrans_date BETWEEN _r.period_start and _r.period_end )
         -- AND   (gltrans_accnt_id=_p.trialbal_accnt_id)
         -- AND   (gltrans_posted) );
        -- and change 2nd and 3rd VALUES line of INSERT to read
        --      _ending, _ending + _glAmount,
        --      noneg(0 - _glAmount), noneg(_glAmount), FALSE );

      INSERT INTO trialbal
      ( trialbal_period_id, trialbal_accnt_id,
        trialbal_beginning, trialbal_ending,
        trialbal_debits, trialbal_credits, trialbal_dirty )
      VALUES
      ( _r.period_id, _p.trialbal_accnt_id,
        _ending, _ending,
        0, 0, FALSE );
    ELSE
      UPDATE trialbal
      SET trialbal_beginning = (_ending + trialbal_yearend),
          trialbal_ending = (_ending + trialbal_yearend - _r.trialbal_debits + _r.trialbal_credits),
          trialbal_dirty = FALSE
      WHERE (trialbal_id=_r.trialbal_id);

      _ending = (_ending + _r.trialbal_yearend - _r.trialbal_debits + _r.trialbal_credits);
    END IF;
  END LOOP;

  UPDATE trialbal
  SET trialbal_dirty = FALSE
  WHERE (trialbal_id=pTrialbalid);

  RETURN pTrialbalid;

END;
$$ LANGUAGE 'plpgsql';

