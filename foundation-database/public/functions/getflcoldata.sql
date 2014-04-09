CREATE OR REPLACE FUNCTION getflcoldata(int4, int4)
  RETURNS SETOF flcoldata AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pFlcolid ALIAS FOR $1;
  pPeriodid ALIAS FOR $2;
  _row flcoldata%ROWTYPE;
  _r RECORD;
  _start DATE;
  _end DATE;
  _col INTEGER := 1;
  _mult INTEGER;

BEGIN

--Get Layout Data
  SELECT * INTO _r
  FROM flcol
  WHERE (flcol_id=pFlcolid);

-- Handle Month...
  IF (_r.flcol_month) THEN
    SELECT period_start, period_end INTO _start, _end
    FROM period
    WHERE (period_id=pPeriodid);
    
    IF (_r.flcol_showdb) THEN
      -- Debits Column
      _row.flcoldata_column := _col;
      _row.flcoldata_start := _start;
      _row.flcoldata_end := _end;
      RETURN NEXT _row;
      _col := _col + 1;

      -- Credits Column
      _row.flcoldata_column := _col;
      _row.flcoldata_start := _start;
      _row.flcoldata_end := _end;
      RETURN NEXT _row;
      _col := _col + 1;
    END IF;

    -- Month Column
    _row.flcoldata_column := _col;
    _row.flcoldata_start := _start;
    _row.flcoldata_end := _end;
    RETURN NEXT _row;
    _col := _col + 1;

    -- These don't have drill down
    IF (_r.flcol_prcnt) THEN 
      _col := _col + 1;
    END IF;
    IF (_r.flcol_budget) THEN
      _col := _col + 1;
      IF (_r.flcol_budgetprcnt) THEN
        _col := _col + 1;
      END IF;
      IF (_r.flcol_budgetdiff) THEN
        _col := _col + 1;
      END IF;
      IF (_r.flcol_budgetdiffprcnt) THEN
        _col := _col + 1;
      END IF;
    END IF; 
  END IF;

-- Handle Quarter...
  IF (_r.flcol_quarter) THEN
    SELECT min(qtr.period_start), max(qtr.period_end) INTO _start, _end
    FROM period p
     JOIN period qtr ON (p.period_quarter=qtr.period_quarter)
                     AND (p.period_yearperiod_id=qtr.period_yearperiod_id)
    WHERE (p.period_id=pPeriodid);
    
    IF (_r.flcol_showdb) THEN
      -- Debits Column
      _row.flcoldata_column := _col;
      _row.flcoldata_start := _start;
      _row.flcoldata_end := _end;
      RETURN NEXT _row;
      _col := _col + 1;

      -- Credits Column
      _row.flcoldata_column := _col;
      _row.flcoldata_start := _start;
      _row.flcoldata_end := _end;
      RETURN NEXT _row;
      _col := _col + 1;
    END IF;

    -- Quarter Column
    _row.flcoldata_column := _col;
    _row.flcoldata_start := _start;
    _row.flcoldata_end := _end;
    RETURN NEXT _row;
    _col := _col + 1;

    -- These don't have drill down
    IF (_r.flcol_prcnt) THEN 
      _col := _col + 1;
    END IF;
    IF (_r.flcol_budget) THEN
      _col := _col + 1;
      IF (_r.flcol_budgetprcnt) THEN
        _col := _col + 1;
      END IF;
      IF (_r.flcol_budgetdiff) THEN
        _col := _col + 1;
      END IF;
      IF (_r.flcol_budgetdiffprcnt) THEN
        _col := _col + 1;
      END IF;
    END IF; 
  END IF;

-- Handle Year...
  IF (_r.flcol_year) THEN
    SELECT yearperiod_start, period_end INTO _start, _end
    FROM period p
     JOIN yearperiod ON (period_yearperiod_id=yearperiod_id)
    WHERE (p.period_id=pPeriodid);
    
    IF (_r.flcol_showdb) THEN
      -- Debits Column
      _row.flcoldata_column := _col;
      _row.flcoldata_start := _start;
      _row.flcoldata_end := _end;
      RETURN NEXT _row;
      _col := _col + 1;

      -- Credits Column
      _row.flcoldata_column := _col;
      _row.flcoldata_start := _start;
      _row.flcoldata_end := _end;
      RETURN NEXT _row;
      _col := _col + 1;
    END IF;

    -- Year Column
    _row.flcoldata_column := _col;
    _row.flcoldata_start := _start;
    _row.flcoldata_end := _end;
    RETURN NEXT _row;
    _col := _col + 1;

    -- These don't have drill down
    IF (_r.flcol_prcnt) THEN 
      _col := _col + 1;
    END IF;
    IF (_r.flcol_budget) THEN
      _col := _col + 1;
      IF (_r.flcol_budgetprcnt) THEN
        _col := _col + 1;
      END IF;
      IF (_r.flcol_budgetdiff) THEN
        _col := _col + 1;
      END IF;
      IF (_r.flcol_budgetdiffprcnt) THEN
        _col := _col + 1;
      END IF;
    END IF;
  END IF;

  -- Handle Prior Month...
  IF (_r.flcol_priormonth) THEN
    SELECT prv.period_start, prv.period_end INTO _start, _end
    FROM period p
      JOIN period prv ON (prv.period_start < p.period_start)
    WHERE (p.period_id=pPeriodid)
    ORDER BY prv.period_start DESC
    LIMIT 1;

    -- Prior Month Column
    _row.flcoldata_column := _col;
    _row.flcoldata_start := _start;
    _row.flcoldata_end := _end;
    RETURN NEXT _row;
    _col := _col + 1;

    -- These don't have drill down
    IF (_r.flcol_priorprcnt) THEN 
      _col := _col + 1;
    END IF;
    IF (_r.flcol_priordiff) THEN 
      _col := _col + 1;
    END IF;
    IF (_r.flcol_priordiffprcnt) THEN 
      _col := _col + 1;
    END IF;
  END IF;

-- Handle Prior Quarter...
  IF (_r.flcol_priorquarter) THEN
    IF (_r.flcol_priortype = 'P') THEN
      -- Prior Quarter
      SELECT min(period_start), max(period_end)
      INTO _start, _end
      FROM (
        SELECT prv.period_start, prv.period_end, prv.period_quarter, prv.period_yearperiod_id
        FROM period p
          JOIN period prv ON (prv.period_start < p.period_start)
                          AND (prv.period_quarter != p.period_quarter)
        WHERE (p.period_id=pPeriodid)) data
      GROUP BY period_quarter, period_yearperiod_id
      ORDER BY min(period_start) DESC
      LIMIT 1;
    ELSE
      -- Prior Year Quarter
      SELECT min(period_start), max(period_end)
      INTO _start, _end
      FROM (
        SELECT prv.period_start, prv.period_end, prv.period_quarter, prv.period_yearperiod_id
        FROM period p
          JOIN period prv ON (prv.period_start < p.period_start)
                          AND (prv.period_yearperiod_id != p.period_yearperiod_id)
                          AND (prv.period_quarter = p.period_quarter)
        WHERE (p.period_id=pPeriodid)) data
      GROUP BY period_quarter, period_yearperiod_id
      ORDER BY min(period_start) DESC
      LIMIT 1;
    END IF;

    -- Prior Quarter Column
    _row.flcoldata_column := _col;
    _row.flcoldata_start := _start;
    _row.flcoldata_end := _end;
    RETURN NEXT _row;
    _col := _col + 1;

    -- These don't have drill down
    IF (_r.flcol_priorprcnt) THEN 
      _col := _col + 1;
    END IF;
    IF (_r.flcol_priordiff) THEN 
      _col := _col + 1;
    END IF;
    IF (_r.flcol_priordiffprcnt) THEN 
      _col := _col + 1;
    END IF;
  END IF;

  -- Handle Prior Year...
  IF (_r.flcol_prioryear IN ('D','F')) THEN
    IF (_r.flcol_prioryear = 'D') THEN
      -- Prior Year to Date
      SELECT yearperiod_start, prv.period_end INTO _start, _end
      FROM period p
        JOIN period prv ON (prv.period_number = p.period_number)
                        AND (prv.period_yearperiod_id != p.period_yearperiod_id)
                        AND (prv.period_start < p.period_start)
        JOIN yearperiod ON (prv.period_yearperiod_id=yearperiod_id)   
      WHERE (p.period_id=pPeriodid)
      ORDER BY prv.period_start DESC
      LIMIT 1;
    ELSE
      -- Prior Full Year
      SELECT prv.yearperiod_start, prv.yearperiod_end INTO _start, _end
      FROM period p
        JOIN yearperiod cur ON (cur.yearperiod_id=p.period_yearperiod_id)
        JOIN yearperiod prv ON (prv.yearperiod_start < cur.yearperiod_start)
      WHERE (p.period_id=pPeriodid)
      ORDER BY prv.yearperiod_start DESC
      LIMIT 1;
    END IF;

    -- Prior Year Column
    _row.flcoldata_column := _col;
    _row.flcoldata_start := _start;
    _row.flcoldata_end := _end;
    RETURN NEXT _row;
    _col := _col + 1;

  END IF;

  RETURN;

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION getflcoldata(char(1), int[], boolean)
  RETURNS SETOF flcoldata AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pInterval ALIAS FOR $1;
  pPeriodids ALIAS FOR $2;
  pBudgets ALIAS FOR $3;
  _row flcoldata%ROWTYPE;
  _r RECORD;
  _start DATE;
  _end DATE;
  _col INTEGER := 1;
  _count INTEGER;
  _i INTEGER := 1;
  _incr INTEGER := 1;

BEGIN

  IF (pBudgets) THEN
    _col := 2;
    _incr := 2;
  END IF;
  
  _count := ARRAY_UPPER(pPeriodIds,1);
  
  IF (pInterval = 'M') THEN
    FOR _i IN 1.._count
    LOOP
      SELECT period_start, period_end INTO _start, _end
      FROM period
      WHERE (period_id=pPeriodids[_i]);

      _row.flcoldata_column := _col;
      _row.flcoldata_start := _start;
      _row.flcoldata_end := _end;
      RETURN NEXT _row;
      _col := _col + _incr;
    END LOOP;
  ELSIF (pInterval = 'Q') THEN
    FOR _i IN 1.._count
    LOOP
      SELECT min(qtr.period_start), max(qtr.period_end) INTO _start, _end
      FROM period cur
        JOIN period qtr ON (cur.period_yearperiod_id=qtr.period_yearperiod_id)
                        AND (cur.period_quarter=qtr.period_quarter)
      WHERE (cur.period_id=pPeriodids[_i]);

      _row.flcoldata_column := _col;
      _row.flcoldata_start := _start;
      _row.flcoldata_end := _end;
      RETURN NEXT _row;
      _col := _col + _incr;
    END LOOP;
  ELSE
    FOR _i IN 1.._count
    LOOP
      SELECT yearperiod_start, yearperiod_end INTO _start, _end
      FROM period
        JOIN yearperiod ON (period_yearperiod_id=yearperiod_id)
      WHERE (period_id=pPeriodids[_i]);

      _row.flcoldata_column := _col;
      _row.flcoldata_start := _start;
      _row.flcoldata_end := _end;
      RETURN NEXT _row;
      _col := _col + _incr;
    END LOOP;
  END IF;
  RETURN;

END;
$$ LANGUAGE 'plpgsql';
