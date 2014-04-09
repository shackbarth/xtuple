
CREATE OR REPLACE FUNCTION getperiodid(INTEGER,  char) RETURNS SETOF INTEGER IMMUTABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pPeriodId ALIAS FOR $1;
  pInterval ALIAS FOR $2;
  _x RECORD;
BEGIN

-- Validate Interval
   IF pInterval <> 'M' AND pInterval <> 'Q' AND pInterval <> 'Y' THEN
     RAISE EXCEPTION 'Invalid Interval --> %', pInterval;
   END IF;

   IF pInterval='M' THEN
       RETURN NEXT pPeriodId;
     ELSE IF pInterval='Q' THEN
        FOR _x IN SELECT qp.period_id AS period_id
                FROM period cp, period qp
                WHERE ((cp.period_id=pPeriodId)
                AND (cp.period_yearperiod_id=qp.period_yearperiod_id)
                AND (cp.period_quarter=qp.period_quarter)
                AND (cp.period_start>=qp.period_start))
        ORDER BY qp.period_start
        LOOP
                RETURN NEXT _x.period_id;
        END LOOP;
     ELSE
        FOR _x IN SELECT yp.period_id AS period_id
                FROM period cp, period yp
                WHERE ((cp.period_id=pPeriodId)
                AND (cp.period_yearperiod_id=yp.period_yearperiod_id)
                AND (cp.period_start>=yp.period_start))
        ORDER BY yp.period_start
        LOOP
                RETURN NEXT _x.period_id;
        END LOOP;
     END IF;
   END IF;
  RETURN;
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION getPeriodId(date)
  RETURNS integer AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pPeriodDate ALIAS FOR $1;
  _returnVal INTEGER;
BEGIN
  IF (pPeriodDate IS NULL) THEN
	RETURN NULL;
  END IF;

  SELECT period_id INTO _returnVal
  FROM period
  WHERE ((pPeriodDate) between period_start AND period_end);

  IF (_returnVal IS NULL) THEN
    RAISE EXCEPTION 'Period for % not found.', pPeriodDate;
  END IF;

  RETURN _returnVal;
END;
$$ LANGUAGE 'plpgsql';
