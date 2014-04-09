
CREATE OR REPLACE FUNCTION updateRetainedEarnings(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pYearPeriodid ALIAS FOR $1;
  _r RECORD;
  _n RECORD;
  _c RECORD;
  _beginningPeriodid INTEGER;
  _trialbalid INTEGER;
  _accntid INTEGER;
  _totalProfitLoss      NUMERIC;
  _periodid INTEGER;
  _forwardupdate INTEGER;
BEGIN

--  First thing we need to do is to get the yearperiod

  SELECT * INTO _r FROM yearperiod where yearperiod_id = pYearPeriodid;

  IF (NOT FOUND) THEN
    RETURN -6;
  END IF;

--  Now we need to find the next yearperiod

  SELECT * INTO _n FROM yearperiod WHERE yearperiod_start = _r.yearperiod_end + interval '1 day';

  IF (NOT FOUND) THEN
    RETURN -4;
  END IF;

--  Now we have to find where to stick the end of year data

  SELECT period_id INTO _periodid FROM period WHERE period_start = _n.yearperiod_start;

  IF (NOT FOUND) THEN
    RETURN -8;
  END IF;

--  Loop through companies and process each one

  IF (coalesce(fetchMetricValue('GLCompanySize'),0) = 0) THEN
  --  Process for installs not using company segment
  --  Now we need to get the default account number for year end closing

    SELECT CAST ( metric_value AS integer ) INTO _accntid FROM metric WHERE metric_name = 'YearEndEquityAccount';

    IF (NOT FOUND) THEN
      RETURN -7;
    END IF;

  --  So far so good.  Now we need to calculate the profit-loss for the year that we are closing

    SELECT SUM(gltrans_amount) INTO _totalProfitLoss
     FROM gltrans, accnt
     WHERE ( (gltrans_accnt_id = accnt_id)
       AND   (accnt_type IN ( 'R', 'E' ) )
       AND   (gltrans_posted)
       AND   (NOT gltrans_deleted)
       AND   (gltrans_date between _r.yearperiod_start and _r.yearperiod_end ) );
    IF (_totalProfitLoss IS NULL) THEN
      _totalProfitLoss := 0;
    END IF;

  -- Get the trailbal_id

    SELECT trialbal_id INTO _trialbalid
      FROM trialbal
     WHERE ( (trialbal_period_id = _periodid )
       AND   (trialbal_accnt_id = _accntid) );

    IF (NOT FOUND) THEN
      RETURN -9;
    END IF;

  -- Lets do the update for the trialbal

    UPDATE trialbal
       SET trialbal_beginning = trialbal_beginning - trialbal_yearend + _totalProfitLoss,
           trialbal_ending = trialbal_beginning - trialbal_yearend - trialbal_debits + trialbal_credits + _totalProfitLoss,
           trialbal_yearend = _totalProfitLoss
     WHERE trialbal_id = _trialbalid;

  -- Now the forward update

    SELECT forwardupdatetrialbalance(_trialbalid) INTO _forwardupdate;
    
  ELSE  -- Process for a multi-company set up
  
    FOR _c IN
      SELECT company_number, company_yearend_accnt_id
      FROM company
    LOOP
  --  Calculate the profit-loss for the year that we are closing

      SELECT SUM(gltrans_amount) INTO _totalProfitLoss
       FROM gltrans, accnt
       WHERE ( (gltrans_accnt_id = accnt_id)
         AND   (accnt_type IN ( 'R', 'E' ) )
         AND   (gltrans_posted)
         AND   (NOT gltrans_deleted)
         AND   (accnt_company = _c.company_number)
         AND   (gltrans_date between _r.yearperiod_start and _r.yearperiod_end ) );
      IF(_totalProfitLoss IS NULL) THEN
        _totalProfitLoss := 0;
      END IF;

    -- Get the trailbal_id

      SELECT trialbal_id INTO _trialbalid
        FROM trialbal
          JOIN accnt ON (trialbal_accnt_id=accnt_id)
       WHERE ( (trialbal_period_id = _periodid )
         AND   (trialbal_accnt_id = _c.company_yearend_accnt_id) );

      IF (NOT FOUND) THEN
        -- Create a trial balance record
        SELECT NEXTVAL('trialbal_trialbal_id_seq') INTO _trialbalid;
        INSERT INTO trialbal
          ( trialbal_id, trialbal_accnt_id, trialbal_period_id,
            trialbal_beginning, trialbal_dirty,
            trialbal_ending,
            trialbal_credits,
            trialbal_debits,
            trialbal_yearend )
        VALUES
          ( _trialbalid, _c.company_yearend_accnt_id, _periodid,
            _totalProfitLoss, TRUE,
            _totalProfitLoss,
            0,
            0,
            _totalProfitLoss );
      ELSE
        -- Lets do the update for the trialbal
        UPDATE trialbal
           SET trialbal_beginning = trialbal_beginning - trialbal_yearend + _totalProfitLoss,
               trialbal_ending = trialbal_beginning - trialbal_yearend - trialbal_debits + trialbal_credits + _totalProfitLoss,
               trialbal_yearend = _totalProfitLoss
         WHERE trialbal_id = _trialbalid;
      END IF;

    -- Now the forward update

      SELECT forwardupdatetrialbalance(_trialbalid) INTO _forwardupdate;

    END LOOP;
  END IF;

  RETURN 0;

END;
$$ LANGUAGE 'plpgsql';

