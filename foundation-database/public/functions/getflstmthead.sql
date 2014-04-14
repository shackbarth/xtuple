CREATE OR REPLACE FUNCTION getflstmthead(int4, int4)
  RETURNS SETOF flstmthead AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pFlcolid ALIAS FOR $1;
  pPeriodid ALIAS FOR $2;
  _row flstmthead%ROWTYPE;
  _p RECORD;
  _month TEXT;
  _qtr TEXT;
  _year TEXT;
  _prmonth TEXT;
  _prqtr TEXT;
  _pryear TEXT;
  _err TEXT;

BEGIN

  SELECT 'No Data' INTO _err;

--Get Layout Data
  SELECT flcol_priortype, flcol_prioryear INTO _p
  FROM flcol
  WHERE (flcol_id=pFlcolid);

--get data...
--...for current Month
        SELECT
          (CASE
                      WHEN period_name='' THEN
                        formatdate(period_start) || '-' || formatdate(period_end)
                      ELSE period_name
          END) INTO _month
        FROM period
        WHERE (period_id=pPeriodId);

        IF _month IS NULL THEN
          _month := _err;
        END IF;

--...for Quarter
        SELECT
          ('Q' || period_quarter || '-' || EXTRACT(year from yearperiod_end)) INTO _qtr
        FROM period, yearperiod
        WHERE ((period_id=pPeriodId)
        AND (period_yearperiod_id=yearperiod_id));

        IF _qtr IS NULL THEN
          _qtr := _err;
        END IF;

--...for Year
        SELECT
          COALESCE((CASE WHEN period_name='' THEN
                (formatdate(period_start) || '-' || formatdate(period_end) || ' YTD')
          ELSE (period_name || ' YTD')
          END),'No Data') INTO _year
        FROM period
        WHERE (period_id=pPeriodId);

        IF _year IS NULL THEN
          _year := _err;
        END IF;

--...for prior month

        IF (_p.flcol_priortype = 'P') THEN

          SELECT
            (CASE WHEN pp.period_name='' THEN
              formatdate(pp.period_start) || '-' || formatdate(pp.period_end)
            ELSE pp.period_name END) INTO _prmonth
          FROM period cp, period pp
          WHERE ((cp.period_id=pPeriodId)
          AND (cp.period_start > pp.period_start))
          ORDER BY pp.period_start DESC LIMIT 1;

        ELSE

          SELECT
            (CASE WHEN pp.period_name='' THEN
              formatdate(pp.period_start) || '-' || formatdate(pp.period_end)
            ELSE pp.period_name END) INTO _prmonth
          FROM period cp, period pp
          WHERE ((cp.period_id=pPeriodId)
           AND (cp.period_id != pp.period_id)
           AND (cp.period_start > pp.period_start)
           AND (cp.period_number = pp.period_number))
          ORDER BY pp.period_start DESC LIMIT 1;

        END IF;

          IF _prmonth IS NULL THEN
            _prmonth := _err;
          END IF;


--...for prior quarter

        IF (_p.flcol_priortype='P') THEN

          SELECT ('Q' || pp.period_quarter || '-' || EXTRACT(year from yearperiod_end)) INTO _prqtr
          FROM period cp, period pp, yearperiod
          WHERE ((cp.period_id=pPeriodId)
          AND (cp.period_start > pp.period_start)
          AND (pp.period_quarter=
            CASE WHEN cp.period_quarter > 1 THEN
              cp.period_quarter - 1
          ELSE 4 END)
          AND (pp.period_start >= cp.period_start - interval '1 year')
          AND (pp.period_yearperiod_id=yearperiod_id))
          ORDER BY pp.period_start DESC LIMIT 1;

        ELSE

          SELECT
            ('Q' || pp.period_quarter || '-' || EXTRACT(year from pp.period_start)) INTO _prqtr
          FROM period cp, period pp, yearperiod cy, yearperiod py
          WHERE ((cp.period_id=pPeriodId)
          AND (cp.period_yearperiod_id=cy.yearperiod_id)
          AND (pp.period_yearperiod_id=py.yearperiod_id)
          AND (cp.period_quarter=pp.period_quarter)
          AND (cy.yearperiod_start > py.yearperiod_start))
          ORDER BY py.yearperiod_start DESC, pp.period_start DESC LIMIT 1;

        END IF;

        IF _prqtr IS NULL THEN
          _prqtr := _err;
        END IF;

--...for prior year

        IF (_p.flcol_prioryear='F') THEN

          SELECT (EXTRACT(year from py.yearperiod_end)||'') INTO _pryear
          FROM period cp, yearperiod cy, yearperiod py
          WHERE ((cp.period_id=pPeriodId)
           AND (cp.period_yearperiod_id = cy.yearperiod_id)
           AND (cy.yearperiod_start > py.yearperiod_start))
          ORDER BY py.yearperiod_start DESC LIMIT 1;

        ELSE

          SELECT
          (CASE
                      WHEN pp.period_name='' THEN
                        formatdate(pp.period_start) || '-' || formatdate(pp.period_end) || ' YTD'
                      ELSE pp.period_name || ' YTD'
          END) INTO _pryear
          FROM period cp, period pp
          WHERE ((cp.period_id=pPeriodId)
            AND (cp.period_number = pp.period_number)
            AND (cp.period_start > pp.period_start))
          ORDER BY pp.period_start DESC LIMIT 1;

        END IF;

        IF _pryear IS NULL THEN
          _pryear := _err;
        END IF;

-- RETURN RESULTS

        SELECT
                flhead_id AS flstmthead_flhead_id,
                flcol_id AS flstmthead_flcol_id,
                pPeriodid AS flstmthead_period,
                getEffectiveXtUser() AS flstmthead_username,
                CASE
                        WHEN flhead_type = 'I' THEN 'Income Statement'
                        WHEN flhead_type = 'B' THEN 'Balance Sheet'
                        WHEN flhead_type = 'C' THEN 'Cash Flow Statement'
                        ELSE 'N/A'
                END AS flstmthead_flhead_typedescrip1,
                CASE
                        WHEN flhead_type = 'I' THEN 'Income'
                        WHEN flhead_type = 'B' THEN 'Balance'
                        WHEN flhead_type = 'C' THEN 'Cash'
                        ELSE 'N/A'
                END AS flstmthead_flhead_typedescrip2,
                flhead_name AS flstmthead_flhead_name,
                flcol_name AS flstmthead_flcol_name,
                _month AS flstmthead_month,
                _qtr AS flstmthead_qtr,
                _year AS flstmthead_year,
                _prmonth AS flstmthead_prmonth,
                _prqtr AS flstmthead_prqtr,
                _pryear AS flstmthead_pryear INTO _p
        FROM flhead,flcol
        WHERE ((flcol_id=pFlcolid)
        AND (flhead_id=flcol_flhead_id));

                _row.flstmthead_flhead_id := _p.flstmthead_flhead_id;
                _row.flstmthead_flcol_id := _p.flstmthead_flcol_id;
                _row.flstmthead_period_id := _p.flstmthead_period;
                _row.flstmthead_username := _p.flstmthead_username;
                _row.flstmthead_typedescrip1 := _p.flstmthead_flhead_typedescrip1;
                _row.flstmthead_typedescrip2 := _p.flstmthead_flhead_typedescrip2;
                _row.flstmthead_flhead_name := _p.flstmthead_flhead_name;
                _row.flstmthead_flcol_name := _p.flstmthead_flcol_name;
                _row.flstmthead_month := _p.flstmthead_month;
                _row.flstmthead_qtr := _p.flstmthead_qtr;
                _row.flstmthead_year := _p.flstmthead_year;
                _row.flstmthead_prmonth := _p.flstmthead_prmonth;
                _row.flstmthead_prqtr := _p.flstmthead_prqtr;
                _row.flstmthead_pryear := _p.flstmthead_pryear;

        RETURN NEXT _row;

END;
$$ LANGUAGE 'plpgsql';
