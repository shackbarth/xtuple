
CREATE OR REPLACE FUNCTION formatPeriodName( INTEGER,  char) RETURNS text AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pPeriodId ALIAS FOR $1;
  pInterval ALIAS FOR $2;
  _result TEXT;

BEGIN

--...for Month

   IF (pInterval=''M'') THEN
        SELECT
          (CASE
                      WHEN period_name='''' THEN
                        formatdate(period_start) || ''-'' || formatdate(period_end)
                      ELSE period_name
          END) INTO _result
        FROM period
        WHERE (period_id=pPeriodId);

        RETURN _result;

--...for Quarter

        ELSE IF (pInterval=''Q'') THEN
                SELECT
                        (''Q'' || period_quarter || ''-'' || EXTRACT(year from yearperiod_end)) INTO _result
                FROM period, yearperiod
                WHERE ((period_id=pPeriodId)
                AND (period_yearperiod_id=yearperiod_id));

                RETURN _result;
--...for Year
        ELSE
                SELECT
                        EXTRACT(year FROM yearperiod_end) INTO _result
                FROM period,yearperiod
                WHERE ((period_id=pPeriodId)
                AND (period_yearperiod_id=yearperiod_id));

                RETURN _result;
        END IF;
   END IF;

   RETURN ''Err'';

END;
' LANGUAGE 'plpgsql';

