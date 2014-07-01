SELECT dropIfExists('FUNCTION','financialreport(INTEGER, INTEGER)');
SELECT dropIfExists('FUNCTION','financialreport(INTEGER, INTEGER, bpchar)');
SELECT dropIfExists('FUNCTION','financialreport(INTEGER, INTEGER, bool, bool)');
SELECT dropIfExists('FUNCTION','financialreport(INTEGER,_int4,bpchar,bool)');

CREATE OR REPLACE FUNCTION financialreport(INTEGER, INTEGER, INTEGER) RETURNS bool AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pFlheadid ALIAS FOR $1;
  pPeriodid ALIAS FOR $2;
  pPrjid    ALIAS FOR $3;
  _result bool;

BEGIN

  SELECT financialreport(pFlheadid,pPeriodid,'M', pPrjid) INTO _result;

  RETURN _result;
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION financialreport(INTEGER, INTEGER, bpchar, INTEGER)
  RETURNS bool AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.

/* performance vs. history:
   versions prior to xTuple ERP 4.5.x (x ?= 1) used public.flrpt
   to build financial reports. after that release, the function
   creates a temporary table if necessary. with the temp table,
   flrpt self-joins no longer require comparing flrpt_username -
   temp tables are only visible within the current session. however,
   there are subsidiary functions (eg insertflgroup) that _do_ join
   on flrpt_username. in addition, flrpt_username has a not-null constraint.
   to reduce the risk of breakage, this function still sets flrpt_username.
*/
DECLARE
  pFlheadid ALIAS FOR $1;
  pPeriodid ALIAS FOR $2;
  pInterval ALIAS FOR $3;
  pPrjid    ALIAS FOR $4;

  _r RECORD;
  _t RECORD;
  _s RECORD;
  _username TEXT := getEffectiveXtUser();

BEGIN

-- Validate Interval
   IF pInterval <> 'M' AND pInterval <> 'Q' AND pInterval <> 'Y' THEN
     RAISE EXCEPTION 'Invalid Interval --> %', pInterval;
   END IF;

  CREATE TEMPORARY TABLE IF NOT EXISTS flrpt
    (LIKE public.flrpt INCLUDING ALL)
    ON COMMIT PRESERVE ROWS;

  -- clear even temp tables because every run builds on data upserted by itself
  DELETE FROM flrpt
   WHERE ((flrpt_flhead_id=pFlheadid)
     AND  (flrpt_period_id=pPeriodId)
     AND  (flrpt_interval=pInterval));

-- Find out if we need to show a Grand Total and which if any of the values
-- we want to show in that grand total.
  SELECT flhead_showtotal,
         CASE WHEN(flhead_showstart) THEN 0.00
              ELSE NULL
         END AS beginning,
         CASE WHEN(flhead_showend) THEN 0.00
              ELSE NULL
         END AS ending,
         CASE WHEN(flhead_showdelta) THEN 0.00
              ELSE NULL
         END AS debits,
         CASE WHEN(flhead_showdelta) THEN 0.00
              ELSE NULL
         END AS credits,
         CASE WHEN(flhead_showbudget) THEN 0.00
              ELSE NULL
         END AS budget,
         CASE WHEN(flhead_showdiff) THEN 0.00
              ELSE NULL
         END AS diff,
         CASE WHEN(flhead_showcustom) THEN 0.00
              ELSE NULL
         END AS custom,
         CASE WHEN(flhead_usealttotal) THEN flhead_alttotal
              ELSE NULL
         END AS altname INTO _r
    FROM flhead
   WHERE (flhead_id=pFlheadid);
  IF (NOT FOUND) THEN
    return FALSE;
  END IF;

-- If showing a Grand Total then create a record as a Group which acts
-- as a parent to the whole report. This allows the code to update as
-- it would for normal group total values.
  IF (_r.flhead_showtotal) THEN
    INSERT INTO flrpt
           (flrpt_flhead_id, flrpt_period_id, flrpt_username,
            flrpt_order, flrpt_level, flrpt_type, flrpt_type_id,
            flrpt_beginning, flrpt_ending,
            flrpt_debits, flrpt_credits, flrpt_budget, flrpt_diff,
            flrpt_custom, flrpt_altname, flrpt_interval )
    VALUES (pFlheadid, pPeriodid, _username,
            0, -1, 'G', -1,
            _r.beginning, _r.ending,
            _r.debits, _r.credits, _r.budget, _r.diff,
            _r.custom, _r.altname, pInterval );
  END IF;

  PERFORM insertFlGroup(pFlheadid, pPeriodid, -1, 0, FALSE, pInterval, pPrjid);

-- go through the list of records that need percentages calculated and perform
-- those calculations.
  FOR _t IN SELECT flrpt_order, CASE WHEN(flgrp_prcnt_flgrp_id = -1) THEN flgrp_flgrp_id ELSE flgrp_prcnt_flgrp_id END AS flgrp_id
              FROM flrpt, flgrp
             WHERE ((flrpt_flhead_id=pFlheadid)
               AND  (flrpt_period_id=pPeriodid)
               AND  (flrpt_interval=pInterval)
               AND  (flrpt_type='G')
               AND  (flrpt_type_id=flgrp_id))
             UNION
            SELECT flrpt_order, CASE WHEN(flitem_prcnt_flgrp_id = -1) THEN flitem_flgrp_id ELSE flitem_prcnt_flgrp_id END AS flgrp_id
              FROM flrpt, flitem
             WHERE ((flrpt_flhead_id=pFlheadid)
               AND  (flrpt_period_id=pPeriodid)
               AND  (flrpt_interval=pInterval)
               AND  (flrpt_type='I')
               AND  (flrpt_type_id=flitem_id))
             UNION
            SELECT flrpt_order, CASE WHEN(flspec_prcnt_flgrp_id = -1) THEN flspec_flgrp_id ELSE flspec_prcnt_flgrp_id END AS flgrp_id
              FROM flrpt, flspec
             WHERE ((flrpt_flhead_id=pFlheadid)
               AND  (flrpt_period_id=pPeriodid)
               AND  (flrpt_interval=pInterval)
               AND  (flrpt_type='S')
               AND  (flrpt_type_id=flspec_id)) LOOP

    IF( (_t.flgrp_id=-1) OR (NOT (SELECT flgrp_summarize FROM flgrp WHERE flgrp_id=_t.flgrp_id)) ) THEN
      SELECT COALESCE(SUM(flrpt_beginning),0) AS beginningTotal,
             COALESCE(SUM(flrpt_ending),0) AS endingTotal,
             COALESCE(SUM(flrpt_debits),0) AS debitsTotal,
             COALESCE(SUM(flrpt_credits),0) AS creditsTotal,
             COALESCE(SUM(flrpt_budget),0) AS budgetTotal,
             COALESCE(SUM(flrpt_diff), 0) AS diffTotal,
             COALESCE(SUM(flrpt_custom), 0) AS customTotal INTO _s
        FROM flrpt
       WHERE ((flrpt_flhead_id=pFlheadid)
         AND  (flrpt_period_id=pPeriodid)
         AND  (flrpt_interval=pInterval)
         AND  (flrpt_type != 'T')
         AND  (flrpt_parent_id=_t.flgrp_id));
    ELSE
      SELECT COALESCE(SUM(flrpt_beginning),0) AS beginningTotal,
             COALESCE(SUM(flrpt_ending),0) AS endingTotal,
             COALESCE(SUM(flrpt_debits),0) AS debitsTotal,
             COALESCE(SUM(flrpt_credits),0) AS creditsTotal,
             COALESCE(SUM(flrpt_budget),0) AS budgetTotal,
             COALESCE(SUM(flrpt_diff), 0) AS diffTotal,
             COALESCE(SUM(flrpt_custom), 0) AS customTotal INTO _s
        FROM flrpt
       WHERE ((flrpt_flhead_id=pFlheadid)
         AND  (flrpt_period_id=pPeriodid)
         AND  (flrpt_interval=pInterval)
         AND  (flrpt_type = 'G')
         AND  (flrpt_type_id=_t.flgrp_id));
    END IF;

    UPDATE flrpt SET flrpt_beginningprcnt = flrpt_beginningprcnt + flrpt_beginning / CASE WHEN (_s.beginningTotal=0) THEN 1 ELSE _s.beginningTotal END,
                     flrpt_endingprcnt = flrpt_endingprcnt + flrpt_ending / CASE WHEN (_s.endingTotal=0) THEN 1 ELSE _s.endingTotal END,
                     flrpt_debitsprcnt = flrpt_debitsprcnt + flrpt_debits / CASE WHEN (_s.debitsTotal=0) THEN 1 ELSE _s.debitsTotal END,
                     flrpt_creditsprcnt = flrpt_creditsprcnt + flrpt_credits / CASE WHEN (_s.creditsTotal=0) THEN 1 ELSE _s.creditsTotal END,
                     flrpt_budgetprcnt = flrpt_budgetprcnt + flrpt_budget / CASE WHEN (_s.budgetTotal=0) THEN 1 ELSE _s.budgetTotal END,
                     flrpt_diffprcnt = flrpt_diffprcnt + flrpt_diff / CASE WHEN (_s.diffTotal=0) THEN 1 ELSE _s.diffTotal END,
                     flrpt_customprcnt = flrpt_customprcnt + flrpt_custom / CASE WHEN (_s.customTotal=0) THEN 1 ELSE _s.customTotal END
     WHERE ((flrpt_flhead_id=pFlheadid)
       AND  (flrpt_period_id=pPeriodid)
       AND  (flrpt_interval=pInterval)
       AND  (flrpt_order=_t.flrpt_order));
  END LOOP;


-- Update any subtotal records to reflect the percentage values of the parents
-- since those are calculated after the subtotal records were created.
  FOR _t IN SELECT a.flrpt_order AS flrpt_order,
                   b.flrpt_beginningprcnt AS flrpt_beginningprcnt,
                   b.flrpt_endingprcnt AS flrpt_endingprcnt,
                   b.flrpt_debitsprcnt AS flrpt_debitsprcnt,
                   b.flrpt_creditsprcnt AS flrpt_creditsprcnt,
                   b.flrpt_budgetprcnt AS flrpt_budgetprcnt,
                   b.flrpt_diffprcnt AS flrpt_diffprcnt,
                   b.flrpt_customprcnt AS flrpt_customprcnt
              FROM flrpt AS a, flrpt AS b
             WHERE ((a.flrpt_flhead_id=pFlheadid)
               AND  (a.flrpt_period_id=pPeriodid)
               AND  (a.flrpt_interval=pInterval)
               AND  (a.flrpt_type='T')
               AND  (b.flrpt_flhead_id=a.flrpt_flhead_id)
               AND  (b.flrpt_period_id=a.flrpt_period_id)
               AND  (b.flrpt_interval=pInterval)
               AND  (b.flrpt_type='G')
               AND  (b.flrpt_type_id=a.flrpt_parent_id)) LOOP
    UPDATE flrpt SET flrpt_beginningprcnt=flrpt_beginningprcnt + _t.flrpt_beginningprcnt,
                     flrpt_endingprcnt=flrpt_endingprcnt + _t.flrpt_endingprcnt,
                     flrpt_debitsprcnt=flrpt_debitsprcnt + _t.flrpt_debitsprcnt,
                     flrpt_creditsprcnt=flrpt_creditsprcnt + _t.flrpt_creditsprcnt,
                     flrpt_budgetprcnt=flrpt_budgetprcnt + _t.flrpt_budgetprcnt,
                     flrpt_diffprcnt=flrpt_diffprcnt + _t.flrpt_diffprcnt,
                     flrpt_customprcnt=flrpt_customprcnt + _t.flrpt_customprcnt
               WHERE ((flrpt_flhead_id=pFlheadid)
                 AND  (flrpt_period_id=pPeriodid)
                 AND  (flrpt_interval=pInterval)
                 AND  (flrpt_order=_t.flrpt_order));
  END LOOP;

-- If showing a Grand total then move the record we created early to the
-- end of the report and marked as a Total record.
  IF (_r.flhead_showtotal) THEN
    UPDATE flrpt
       SET flrpt_order = COALESCE((SELECT MAX(flrpt_order)
                                     FROM flrpt
                                    WHERE ((flrpt_flhead_id=pFlheadid)
                                      AND  (flrpt_period_id=pPeriodid)
                                      AND  (flrpt_interval=pInterval)
                                    )
                                  ), 0) + 1,
           flrpt_level = 0,
           flrpt_type = 'T'
     WHERE ((flrpt_flhead_id=pFlheadid)
       AND  (flrpt_period_id=pPeriodid)
       AND  (flrpt_interval=pInterval)
       AND  (flrpt_order=0)
       AND  (flrpt_level = -1)
       AND  (flrpt_type = 'G')
       AND  (flrpt_type_id=-1));
  END IF;

  return TRUE;
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION financialreport(INTEGER, INTEGER, bool, bool, INTEGER)
  RETURNS SETOF flstmtitem AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
-- see "performance vs. history" in financialreport(integer,integer,bpchar,integer)
DECLARE
  pFlcolid ALIAS FOR $1;
  pPeriodid ALIAS FOR $2;
  pShowNumbers ALIAS FOR $3;
  pIndentName ALIAS FOR $4;
  pPrjid ALIAS FOR $5;
  _row flstmtitem%ROWTYPE;
  _p RECORD;
  _x RECORD;
  _priorMoPeriodId INTEGER;
  _priorQtPeriodId INTEGER;
  _priorYrPeriodId INTEGER;
  _first BOOLEAN;
  _prevlevel INTEGER;
  _subgrp INTEGER;
  _qtrInterval TEXT;
--_username TEXT := getEffectiveXtUser();
  _yrInterval TEXT;

BEGIN

  _priorMoPeriodId := -1;
  _priorQtPeriodId := -1;
  _priorYrPeriodId := -1;
  _first := TRUE;
  _prevlevel :=0;
  _subgrp := 0;

--Get Layout Data
  SELECT flhead_id,flhead_type,
        flcol_month,flcol_quarter,flcol_year,flcol_priortype,
        flcol_priormonth,flcol_priorquarter,flcol_prioryear,
        flcol_priordiff,flcol_priordiffprcnt,flcol_priorprcnt,
        flcol_budget,flcol_budgetdiff,flcol_budgetdiffprcnt,
        flcol_budgetprcnt INTO _p
  FROM flhead,flcol
  WHERE ((flcol_id=pFlcolid)
  AND (flhead_id=flcol_flhead_id));

  IF (_p.flhead_type='B') THEN
    _qtrInterval := 'M';
    _yrInterval := 'M';
  ELSE
    _qtrInterval := 'Q';
    _yrInterval := 'Y';
  END IF;

  CREATE TEMPORARY TABLE IF NOT EXISTS flrpt
    (LIKE public.flrpt INCLUDING ALL)
    ON COMMIT PRESERVE ROWS;

  -- clear even temp tables because every run builds on data upserted by itself
  DELETE FROM flrpt
  WHERE (flrpt_flhead_id=_p.flhead_id);

--Populate report data...
--...for Month
      IF (_p.flcol_month) THEN

        PERFORM financialreport(_p.flhead_id,pPeriodid,'M',pPrjid);

                IF ((_p.flcol_priortype = 'P') AND (_p.flcol_priormonth)) THEN

                        SELECT COALESCE(pp.period_id,-1) INTO _priorMoPeriodId
                        FROM period cp, period pp
                        WHERE ((cp.period_id=pPeriodId)
                        AND (cp.period_start > pp.period_start))
                        ORDER BY pp.period_start DESC LIMIT 1;

                        IF (_priorMoPeriodId IS NOT NULL) THEN
                                PERFORM financialreport(_p.flhead_id,_priorMoPeriodId,'M',pPrjid);
                        END IF;

                        ELSE IF ((_p.flcol_priortype='Y')AND (_p.flcol_priormonth)) THEN

                                SELECT COALESCE(pp.period_id,-1) INTO _priorMoPeriodId
                                FROM period cp, period pp
                                WHERE ((cp.period_id=pPeriodId)
                                AND (cp.period_id != pp.period_id)
                                AND (cp.period_start > pp.period_start)
                                AND (cp.period_number = pp.period_number))
                                ORDER BY pp.period_start DESC LIMIT 1;

                                IF (_priorMoPeriodId IS NOT NULL) THEN
                                        PERFORM financialreport(_p.flhead_id,_priorMoPeriodId,'M',pPrjid);
                                END IF;

                        END IF;

                END IF;
        END IF;

--...for Quarter
        IF (_p.flcol_quarter) THEN

        PERFORM financialreport(_p.flhead_id,pPeriodid,'Q',pPrjid);

        END IF;

        IF ((_p.flcol_priortype='P') AND (_p.flcol_priorquarter)) THEN

                SELECT COALESCE(pp.period_id,-1) INTO _priorQtPeriodId
                FROM period cp, period pp
                WHERE ((cp.period_id=pPeriodId)
                AND (cp.period_start > pp.period_start)
                AND (pp.period_quarter=
                        CASE WHEN cp.period_quarter > 1 THEN
                                cp.period_quarter - 1
                        ELSE 4 END)
                AND (pp.period_start >= cp.period_start - interval '1 year'))
                ORDER BY pp.period_start DESC LIMIT 1;

                IF (_priorQtPeriodId IS NOT NULL) THEN
                        PERFORM financialreport(_p.flhead_id,_priorQtPeriodId,'Q',pPrjid);
                END IF;

                ELSE IF ((_p.flcol_priortype='Y')AND (_p.flcol_priorquarter)) THEN

                        SELECT pp.period_id INTO _priorQtPeriodId
                        FROM period cp, period pp, yearperiod cy, yearperiod py
                        WHERE ((cp.period_id=pPeriodId)
                        AND (cp.period_yearperiod_id=cy.yearperiod_id)
                        AND (pp.period_yearperiod_id=py.yearperiod_id)
                        AND (cp.period_quarter=pp.period_quarter)
                        AND (cy.yearperiod_start > py.yearperiod_start))
                        ORDER BY py.yearperiod_start DESC, pp.period_start DESC LIMIT 1;

                        IF (_priorQtPeriodId IS NOT NULL) THEN
                                PERFORM financialreport(_p.flhead_id,_priorQtPeriodId,'Q',pPrjid);
                        END IF;

                END IF;
        END IF;

--...for Year
        IF (_p.flcol_year) THEN

                PERFORM financialreport(_p.flhead_id,pPeriodid,'Y',pPrjid);

        END IF;

        IF (_p.flcol_prioryear='D') THEN

                SELECT COALESCE(pp.period_id,-1) INTO _priorYrPeriodId
                FROM period cp, period pp
                WHERE ((cp.period_id = pPeriodId)
                AND (cp.period_number = pp.period_number)
                AND (cp.period_start > pp.period_start))
                ORDER BY pp.period_start DESC LIMIT 1;

                IF (_priorYrPeriodId IS NOT NULL) THEN
                        PERFORM financialreport(_p.flhead_id,_priorYrPeriodId,'Y',pPrjid);
                END IF;

                ELSE IF (_p.flcol_prioryear='F') THEN

                        SELECT pp.period_id INTO _priorYrPeriodId
                        FROM period cp, period pp, yearperiod cy, yearperiod py
                        WHERE ((cp.period_id=pPeriodId)
                        AND (cp.period_yearperiod_id=cy.yearperiod_id)
                        AND (pp.period_yearperiod_id=py.yearperiod_id)
                        AND (cy.yearperiod_start > py.yearperiod_start))
                        ORDER BY pp.period_start DESC LIMIT 1;

                        IF (_priorYrPeriodId IS NOT NULL) THEN
                                PERFORM financialreport(_p.flhead_id,_priorYrPeriodId,'Y',pPrjid);
                        END IF;

                END IF;
        END IF;

--Return the data
  FOR _x IN
        SELECT
        flrpt.flrpt_flhead_id AS flstmtitem_flhead_id,
        flrpt.flrpt_period_id AS flstmtitem_period_id,
        flrpt.flrpt_username AS flstmtitem_username,
        flrpt.flrpt_order AS flstmtitem_order,
        flrpt.flrpt_level AS flstmtitem_level,
        flrpt.flrpt_type AS flstmtitem_type,
        flrpt.flrpt_type_id AS flstmtitem_type_id,
        flrpt.flrpt_parent_id AS flstmtitem_parent_id,
        NULL AS flstmtitem_accnt_id,
        CASE
                WHEN (pIndentName) THEN
                        formatindent(flgrp.flgrp_name,flrpt.flrpt_level)
                ELSE flgrp.flgrp_name
        END AS flstmtitem_name,
        CASE
                WHEN (flgrp_summarize AND (flhead_type IN ('I','C'))) THEN
                        (COALESCE(flrptmo.flrpt_diff,0))
                WHEN (flgrp_summarize AND (flhead_type = 'B')) THEN
                        (COALESCE(flrptmo.flrpt_ending,0))
                ELSE NULL
        END AS flstmtitem_month,
        CASE
                WHEN (flgrp_summarize) THEN
                        (COALESCE(flrptmo.flrpt_debits,0))
                ELSE NULL
        END AS flstmtitem_monthdb,
        CASE
                WHEN (flgrp_summarize) THEN
                        (COALESCE(flrptmo.flrpt_credits,0))
                ELSE NULL
        END AS flstmtitem_monthcr,
        CASE
                WHEN (flgrp_summarize AND flgrp_showdiffprcnt) THEN
                        (COALESCE(flrptmo.flrpt_diffprcnt,0))
                WHEN (flgrp_summarize AND flgrp_showendprcnt) THEN
                        (COALESCE(flrptmo.flrpt_endingprcnt,0))
                ELSE NULL
        END AS flstmtitem_monthprcnt,
        CASE
                WHEN (flgrp_summarize) THEN
                        (flrptmo.flrpt_budget)
                ELSE NULL
        END AS flstmtitem_monthbudget,
        CASE
                WHEN (flgrp_summarize) THEN
                        (flrptmo.flrpt_budgetprcnt)
                ELSE NULL
        END AS flstmtitem_monthbudgetprcnt,
        CASE
                WHEN (flgrp_summarize AND flhead_type IN ('I','C')) THEN
                        (COALESCE((flrptmo.flrpt_diff-flrptmo.flrpt_budget),0))
                WHEN (flgrp_summarize AND flhead_type = 'B') THEN
                        (COALESCE((flrptmo.flrpt_ending-flrptmo.flrpt_budget),0))
                ELSE NULL
        END AS flstmtitem_monthbudgetdiff,
        CASE
                WHEN (flgrp_summarize AND (flhead_type IN ('I','C')) AND (flrptmo.flrpt_budget > 0)) THEN
                        (COALESCE(((flrptmo.flrpt_diff-flrptmo.flrpt_budget)/flrptmo.flrpt_budget),0))
                WHEN (flgrp_summarize AND (flhead_type='B') AND (flrptmo.flrpt_budget > 0)) THEN
                        (COALESCE(((flrptmo.flrpt_ending-flrptmo.flrpt_budget)/flrptmo.flrpt_budget),0))
                WHEN (flgrp_summarize AND (flrptmo.flrpt_budget = 0)) THEN
                        NULL
                ELSE NULL
        END AS flstmtitem_monthbudgetdiffprcnt,
        CASE
                WHEN (flgrp_summarize AND flhead_type IN ('I','C')) THEN
                        (COALESCE(flrptqt.flrpt_diff,0))
                WHEN (flgrp_summarize AND flhead_type = 'B') THEN
                        (COALESCE(flrptqt.flrpt_ending,0))
                ELSE NULL
        END AS flstmtitem_qtr,
        CASE
                WHEN (flgrp_summarize) THEN
                        (COALESCE(flrptqt.flrpt_debits,0))
                ELSE NULL
        END AS flstmtitem_qtrdb,
        CASE
                WHEN (flgrp_summarize) THEN
                        (COALESCE(flrptqt.flrpt_credits,0))
                ELSE NULL
        END AS flstmtitem_qtrcr,
        CASE
                WHEN (flgrp_summarize AND flgrp_showdiffprcnt) THEN
                        (flrptqt.flrpt_diffprcnt)
                WHEN (flgrp_summarize AND flgrp_showendprcnt) THEN
                        (flrptqt.flrpt_endingprcnt)
                ELSE NULL
        END AS flstmtitem_qtrprcnt,
        CASE
                WHEN (flgrp_summarize) THEN
                        (COALESCE(flrptqt.flrpt_budget,0))
                ELSE NULL
        END AS flstmtitem_qtrbudget,
        CASE
                WHEN (flgrp_summarize) THEN
                        (flrptqt.flrpt_budgetprcnt)
                ELSE NULL
        END AS flstmtitem_qtrbudgetprcnt,
        CASE
                WHEN (flgrp_summarize AND flhead_type IN ('I','C')) THEN
                        (COALESCE((flrptqt.flrpt_diff-flrptqt.flrpt_budget),0))
                WHEN (flgrp_summarize AND flhead_type = 'B') THEN
                        (COALESCE((flrptqt.flrpt_ending-flrptqt.flrpt_budget),0))
                ELSE NULL
        END AS flstmtitem_qtrbudgetdiff,
        CASE
                WHEN (flgrp_summarize AND (flhead_type IN ('I','C')) AND (flrptqt.flrpt_budget > 0)) THEN
                        (COALESCE(((flrptqt.flrpt_diff-flrptqt.flrpt_budget)/flrptqt.flrpt_budget),0))
                WHEN (flgrp_summarize AND (flhead_type='B') AND (flrptqt.flrpt_budget > 0)) THEN
                        (COALESCE(((flrptqt.flrpt_ending-flrptqt.flrpt_budget)/flrptqt.flrpt_budget),0))
                ELSE NULL
        END AS flstmtitem_qtrbudgetdiffprcnt,
        CASE
                WHEN (flgrp_summarize AND flhead_type IN ('I','C')) THEN
                        (COALESCE(flrptyr.flrpt_diff,0))
                WHEN (flgrp_summarize AND flhead_type = 'B') THEN
                        (COALESCE(flrptyr.flrpt_ending,0))
                ELSE NULL
        END AS flstmtitem_year,
        CASE
                WHEN (flgrp_summarize) THEN
                        (COALESCE(flrptyr.flrpt_debits,0))
                ELSE NULL
        END AS flstmtitem_yeardb,
        CASE
                WHEN (flgrp_summarize) THEN
                        (COALESCE(flrptyr.flrpt_credits,0))
                ELSE NULL
        END AS flstmtitem_yearcr,
        CASE
                WHEN (flgrp_summarize AND flgrp_showdiffprcnt) THEN
                        (COALESCE(flrptyr.flrpt_diffprcnt,0))
                WHEN (flgrp_summarize AND flgrp_showendprcnt) THEN
                        (COALESCE(flrptyr.flrpt_endingprcnt,0))
                ELSE NULL
        END AS flstmtitem_yearprcnt,
        CASE
                WHEN (flgrp_summarize) THEN
                        (flrptyr.flrpt_budget)
                ELSE NULL
        END AS  flstmtitem_yearbudget,
        CASE
                WHEN (flgrp_summarize) THEN
                        (flrptyr.flrpt_budgetprcnt)
                ELSE NULL
        END AS flstmtitem_yearbudgetprcnt,
        CASE
                WHEN (flgrp_summarize AND flhead_type IN ('I','C')) THEN
                        (COALESCE((flrptyr.flrpt_diff-flrptyr.flrpt_budget),0))
                WHEN (flgrp_summarize AND flhead_type = 'B') THEN
                        (COALESCE((flrptyr.flrpt_ending-flrptyr.flrpt_budget),0))
                ELSE NULL
        END AS flstmtitem_yearbudgetdiff,
        CASE
                WHEN (flgrp_summarize AND (flhead_type IN ('I','C')) AND (flrptyr.flrpt_budget > 0)) THEN
                        (COALESCE(((flrptyr.flrpt_diff-flrptyr.flrpt_budget)/flrptyr.flrpt_budget),0))
                WHEN (flgrp_summarize AND (flhead_type = 'B') AND (flrptyr.flrpt_budget > 0)) THEN
                        (COALESCE(((flrptyr.flrpt_ending-flrptyr.flrpt_budget)/flrptyr.flrpt_budget),0))
                WHEN (flgrp_summarize AND (flrptyr.flrpt_budget = 0)) THEN
                        NULL
                ELSE NULL
        END AS flstmtitem_yearbudgetdiffprcnt,
        CASE
                WHEN (flgrp_summarize AND flhead_type IN ('I','C')) THEN
                        (COALESCE(flrptprmo.flrpt_diff,0))
                WHEN (flgrp_summarize AND flhead_type = 'B') THEN
                        (COALESCE(flrptprmo.flrpt_ending,0))
                ELSE NULL
        END AS flstmtitem_prmonth,
        CASE
                WHEN (flgrp_summarize AND flgrp_showdiffprcnt) THEN
                        (flrptprmo.flrpt_diffprcnt)
                WHEN (flgrp_summarize AND flgrp_showendprcnt) THEN
                        (flrptprmo.flrpt_endingprcnt)
                ELSE NULL
        END AS flstmtitem_prmonthprcnt,
        CASE
                WHEN (flgrp_summarize AND flhead_type IN ('I','C')) THEN
                        (COALESCE(flrptmo.flrpt_diff-flrptprmo.flrpt_diff,0))
                WHEN (flgrp_summarize AND flhead_type = 'B') THEN
                        (COALESCE(flrptmo.flrpt_ending-flrptprmo.flrpt_ending,0))
                ELSE NULL
        END AS flstmtitem_prmonthdiff,
        CASE
                WHEN (flgrp_summarize AND (flhead_type IN ('I','C')) AND (flrptprmo.flrpt_diff > 0)) THEN
                        (COALESCE((flrptmo.flrpt_diff-flrptprmo.flrpt_diff)/flrptprmo.flrpt_diff,0))
                WHEN (flgrp_summarize AND (flhead_type = 'B') AND (flrptprmo.flrpt_ending > 0)) THEN
                        (COALESCE((flrptmo.flrpt_ending-flrptprmo.flrpt_ending)/flrptprmo.flrpt_ending,0))
                WHEN (flgrp_summarize AND (flrptprmo.flrpt_ending = 0)) THEN
                        NULL
                ELSE NULL
        END AS flstmtitem_prmonthdiffprcnt,
        CASE
                WHEN (flgrp_summarize AND flhead_type IN ('I','C')) THEN
                        (COALESCE(flrptprqt.flrpt_diff,0))
                WHEN (flgrp_summarize AND flhead_type = 'B') THEN
                        (COALESCE(flrptprqt.flrpt_ending,0))
                ELSE NULL
        END AS flstmtitem_prqtr,
        CASE
                WHEN (flgrp_summarize AND flgrp_showdiffprcnt) THEN
                        (flrptprqt.flrpt_diffprcnt)
                WHEN (flgrp_summarize AND flgrp_showendprcnt) THEN
                        (flrptprqt.flrpt_endingprcnt)
                ELSE NULL
        END AS flstmtitem_prqtrprcnt,
        CASE
                WHEN (flgrp_summarize AND flhead_type IN ('I','C')) THEN
                        (COALESCE(flrptqt.flrpt_diff-flrptprqt.flrpt_diff,0))
                WHEN (flgrp_summarize AND flhead_type = 'B') THEN
                        (COALESCE(flrptqt.flrpt_ending-flrptprqt.flrpt_ending,0))
                ELSE NULL
        END AS flstmtitem_prqtrdiff,
        CASE
                WHEN (flgrp_summarize AND (flhead_type IN ('I','C')) AND (flrptprqt.flrpt_diff > 0)) THEN
                        (COALESCE((flrptqt.flrpt_diff-flrptprqt.flrpt_diff)/flrptprqt.flrpt_diff,0))
                WHEN (flgrp_summarize AND (flhead_type = 'B') AND (flrptprqt.flrpt_ending > 0)) THEN
                        (COALESCE((flrptqt.flrpt_ending-flrptprqt.flrpt_ending)/flrptprqt.flrpt_ending,0))
                WHEN (flgrp_summarize AND (flrptprqt.flrpt_ending = 0)) THEN
                        NULL
                ELSE NULL
        END AS flstmtitem_prqtrdiffprcnt,
        CASE
                WHEN (flgrp_summarize AND flhead_type IN ('I','C')) THEN
                        (COALESCE(flrptpryr.flrpt_diff,0))
                WHEN (flgrp_summarize AND flhead_type = 'B') THEN
                        (COALESCE(flrptpryr.flrpt_ending,0))
                ELSE NULL
        END AS flstmtitem_pryear,
        CASE
                WHEN (flgrp_summarize AND flgrp_showdiffprcnt) THEN
                        (flrptpryr.flrpt_diffprcnt)
                WHEN (flgrp_summarize AND flgrp_showendprcnt) THEN
                        (flrptpryr.flrpt_endingprcnt)
                ELSE NULL
        END AS flstmtitem_pryearprcnt,
        CASE
                WHEN (flgrp_summarize AND flhead_type IN ('I','C')) THEN
                        (COALESCE(flrptyr.flrpt_diff-flrptpryr.flrpt_diff,0))
                WHEN (flgrp_summarize AND flhead_type = 'B') THEN
                        (COALESCE(flrptyr.flrpt_ending-flrptpryr.flrpt_ending,0))
                ELSE NULL
        END AS flstmtitem_pryeardiff,
        CASE
                WHEN (flgrp_summarize AND (flhead_type IN ('I','C')) AND (flrptpryr.flrpt_diff > 0)) THEN
                        (COALESCE((flrptyr.flrpt_diff-flrptpryr.flrpt_diff)/flrptpryr.flrpt_diff,0))
                WHEN (flgrp_summarize AND (flhead_type = 'B' ) AND (flrptpryr.flrpt_ending > 0)) THEN
                        (COALESCE((flrptyr.flrpt_ending-flrptpryr.flrpt_ending)/flrptpryr.flrpt_ending,0))
                WHEN (flgrp_summarize AND (flrptpryr.flrpt_ending = 0)) THEN
                        NULL
                ELSE NULL
        END AS flstmtitem_pryeardiffprcnt
        FROM flgrp,flhead,
                (SELECT DISTINCT
                        flrpt_flhead_id,
                        flrpt_period_id,
                        flrpt_username,
                        flrpt_order,
                        flrpt_level,
                        flrpt_type,
                        flrpt_type_id,
                        flrpt_parent_id
                FROM flrpt
                WHERE ((flrpt_type='G')
                AND (flrpt_flhead_id=_p.flhead_id)
                AND (flrpt_period_id=pPeriodId)
                )) AS flrpt
                        LEFT OUTER JOIN flrpt flrptmo
                                ON ((flrptmo.flrpt_type=flrpt.flrpt_type)
                                AND (flrptmo.flrpt_type_id=flrpt.flrpt_type_id)
                                AND (flrptmo.flrpt_flhead_id=flrpt.flrpt_flhead_id)
                                AND (flrptmo.flrpt_period_id=flrpt.flrpt_period_id)
                                AND (flrptmo.flrpt_interval='M')
                                AND (flrptmo.flrpt_order=flrpt.flrpt_order))
                        LEFT OUTER JOIN flrpt flrptqt
                                ON ((flrptqt.flrpt_type=flrpt.flrpt_type)
                                AND (flrptqt.flrpt_type_id=flrpt.flrpt_type_id)
                                AND (flrptqt.flrpt_flhead_id=flrpt.flrpt_flhead_id)
                                AND (flrptqt.flrpt_period_id=flrpt.flrpt_period_id)
                                AND (flrptqt.flrpt_interval=_qtrInterval)
                                AND (flrptqt.flrpt_order=flrpt.flrpt_order))
                        LEFT OUTER JOIN flrpt flrptyr
                                ON ((flrptyr.flrpt_type=flrpt.flrpt_type)
                                AND (flrptyr.flrpt_type_id=flrpt.flrpt_type_id)
                                AND (flrptyr.flrpt_flhead_id=flrpt.flrpt_flhead_id)
                                AND (flrptyr.flrpt_period_id=flrpt.flrpt_period_id)
                                AND (flrptyr.flrpt_interval=_yrInterval)
                                AND (flrptyr.flrpt_order=flrpt.flrpt_order))
                        LEFT OUTER JOIN flrpt flrptprmo
                                ON ((flrptprmo.flrpt_type=flrpt.flrpt_type)
                                AND (flrptprmo.flrpt_type_id=flrpt.flrpt_type_id)
                                AND (flrptprmo.flrpt_flhead_id=flrpt.flrpt_flhead_id)
                                AND (flrptprmo.flrpt_period_id=_priorMoPeriodId)
                                AND (flrptprmo.flrpt_interval='M')
                                AND (flrptprmo.flrpt_order=flrpt.flrpt_order))
                        LEFT OUTER JOIN flrpt flrptprqt
                                ON ((flrptprqt.flrpt_type=flrpt.flrpt_type)
                                AND (flrptprqt.flrpt_type_id=flrpt.flrpt_type_id)
                                AND (flrptprqt.flrpt_flhead_id=flrpt.flrpt_flhead_id)
                                AND (flrptprqt.flrpt_period_id=_priorQtPeriodId)
                                AND (flrptprqt.flrpt_interval='Q')
                                AND (flrptprqt.flrpt_order=flrpt.flrpt_order))
                        LEFT OUTER JOIN flrpt flrptpryr
                                ON ((flrptpryr.flrpt_type=flrpt.flrpt_type)
                                AND (flrptpryr.flrpt_type_id=flrpt.flrpt_type_id)
                                AND (flrptpryr.flrpt_flhead_id=flrpt.flrpt_flhead_id)
                                AND (flrptpryr.flrpt_period_id=_priorYrPeriodId)
                                AND (flrptpryr.flrpt_interval='Y')
                                AND (flrptpryr.flrpt_order=flrpt.flrpt_order))
        WHERE ((flgrp_id = flrpt.flrpt_type_id)
        AND (flhead_id = flgrp_flhead_id))
        UNION
        SELECT
        flrpt.flrpt_flhead_id AS flstmtitem_flhead_id,
        flrpt.flrpt_period_id AS flstmtitem_period_id,
        flrpt.flrpt_username AS flstmtitem_username,
        flrpt.flrpt_order AS flstmtitem_order,
        flrpt.flrpt_level AS flstmtitem_level,
        flrpt.flrpt_type AS flstmtitem_type,
        flrpt.flrpt_type_id AS flstmtitem_type_id,
        flrpt.flrpt_parent_id AS flstmtitem_parent_id,
        flrpt.flrpt_accnt_id AS flstmtitem_accnt_id,
        CASE
                WHEN (pIndentName) THEN
                        formatindent(flrpt.flrpt_name,flrpt.flrpt_level)
                ELSE flrpt.flrpt_name
        END AS flstmtitem_name,
        CASE
                WHEN (flhead_type IN ('I','C')) THEN
                        (COALESCE(flrptmo.flrpt_diff,0))
                ELSE (COALESCE(flrptmo.flrpt_ending,0))
        END AS flstmtitem_month,
        (COALESCE(flrptmo.flrpt_debits,0)) AS flstmtitem_monthdb,
        (COALESCE(flrptmo.flrpt_credits,0)) AS flstmtitem_monthcr,
        CASE
                WHEN (flitem_showdiffprcnt) THEN
                        (flrptmo.flrpt_diffprcnt)
                WHEN (flitem_showendprcnt) THEN
                        (flrptmo.flrpt_endingprcnt)
                ELSE NULL
        END AS flstmtitem_monthprcnt,
        (COALESCE(flrptmo.flrpt_budget,0)) AS flstmtitem_monthbudget,
        (flrptmo.flrpt_budgetprcnt) AS flstmtitem_monthbudgetprcnt,
        CASE
                WHEN (flhead_type IN ('I','C')) THEN
                        (COALESCE((flrptmo.flrpt_diff-flrptmo.flrpt_budget),0))
                ELSE (COALESCE((flrptmo.flrpt_ending-flrptmo.flrpt_budget),0))
        END AS flstmtitem_monthbudgetdiff,
        CASE
                WHEN ((flhead_type IN ('I','C')) AND (flrptmo.flrpt_budget > 0)) THEN
                        (COALESCE(((flrptmo.flrpt_diff-flrptmo.flrpt_budget)/flrptmo.flrpt_budget),0))
                WHEN ((flhead_type='B') AND (flrptmo.flrpt_budget > 0)) THEN
                        (COALESCE(((flrptmo.flrpt_ending-flrptmo.flrpt_budget)/flrptmo.flrpt_budget),0))
                ELSE NULL
        END AS flstmtitem_monthbudgetdiffprcnt,
        CASE
                WHEN (flhead_type IN ('I','C')) THEN
                        (COALESCE(flrptqt.flrpt_diff,0))
                ELSE (COALESCE(flrptqt.flrpt_ending,0))
        END AS flstmtitem_qtr,
        (COALESCE(flrptqt.flrpt_debits,0)) AS flstmtitem_qtrdb,
        (COALESCE(flrptqt.flrpt_credits,0)) AS flstmtitem_qtrcr,
        CASE
                WHEN (flitem_showdiffprcnt) THEN
                        (COALESCE(flrptqt.flrpt_diffprcnt,0))
                WHEN (flitem_showendprcnt) THEN
                        (COALESCE(flrptqt.flrpt_endingprcnt,0))
                ELSE NULL
        END AS flstmtitem_qtrprcnt,
        (COALESCE(flrptqt.flrpt_budget,0)) AS flstmtitem_qtrbudget,
        (flrptqt.flrpt_budgetprcnt) AS flstmtitem_qtrbudgetprcnt,
        CASE
                WHEN (flhead_type IN ('I','C')) THEN
                        (COALESCE((flrptqt.flrpt_diff-flrptqt.flrpt_budget),0))
                ELSE (COALESCE((flrptqt.flrpt_ending-flrptqt.flrpt_budget),0))
        END AS flstmtitem_qtrbudgetdiff,
        CASE
                WHEN ((flhead_type IN ('I','C')) AND (flrptqt.flrpt_budget > 0)) THEN
                        (COALESCE(((flrptqt.flrpt_diff-flrptqt.flrpt_budget)/flrptqt.flrpt_budget),0))
                WHEN ((flhead_type='B') AND (flrptqt.flrpt_budget > 0)) THEN
                        (COALESCE(((flrptqt.flrpt_ending-flrptqt.flrpt_budget)/flrptqt.flrpt_budget),0))
                ELSE NULL
        END AS flstmtitem_qtrbudgetdiffprcnt,
        CASE
                WHEN (flhead_type IN ('I','C')) THEN
                        (COALESCE(flrptyr.flrpt_diff,0))
                ELSE (COALESCE(flrptyr.flrpt_ending,0))
        END AS flstmtitem_year,
        (COALESCE(flrptyr.flrpt_debits,0)) AS flstmtitem_yeardb,
        (COALESCE(flrptyr.flrpt_credits,0)) AS flstmtitem_yearcr,
        CASE
                WHEN (flitem_showdiffprcnt) THEN
                        (flrptyr.flrpt_diffprcnt)
                WHEN (flitem_showendprcnt) THEN
                        (flrptyr.flrpt_endingprcnt)
                ELSE NULL
        END AS flstmtitem_yearprcnt,
        (COALESCE(flrptyr.flrpt_budget,0)) AS  flstmtitem_yearbudget,
        (flrptyr.flrpt_budgetprcnt) AS flstmtitem_yearbudgetprcnt,
        CASE
                WHEN (flhead_type IN ('I','C')) THEN
                        (COALESCE((flrptyr.flrpt_diff-flrptyr.flrpt_budget),0))
                ELSE (COALESCE((flrptyr.flrpt_ending-flrptyr.flrpt_budget),0))
        END AS flstmtitem_yearbudgetdiff,
        CASE
                WHEN ((flhead_type IN ('I','C')) AND (flrptyr.flrpt_budget > 0)) THEN
                        (COALESCE(((flrptyr.flrpt_diff-flrptyr.flrpt_budget)/flrptyr.flrpt_budget),0))
                WHEN ((flhead_type = 'B') AND (flrptyr.flrpt_budget > 0)) THEN
                        (COALESCE(((flrptyr.flrpt_ending-flrptyr.flrpt_budget)/flrptyr.flrpt_budget),0))
                ELSE NULL
        END AS flstmtitem_yearbudgetdiffprcnt,
        CASE
                WHEN (flhead_type IN ('I','C')) THEN
                        (COALESCE(flrptprmo.flrpt_diff,0))
                ELSE (COALESCE(flrptprmo.flrpt_ending,0))
        END AS flstmtitem_prmonth,
        CASE
                WHEN (flitem_showdiffprcnt) THEN
                        (flrptprmo.flrpt_diffprcnt)
                WHEN (flitem_showendprcnt) THEN
                        (flrptprmo.flrpt_endingprcnt)
                ELSE NULL
        END AS flstmtitem_prmonthprcnt,
        CASE
                WHEN (flhead_type IN ('I','C')) THEN
                        (COALESCE(flrptmo.flrpt_diff-flrptprmo.flrpt_diff,0))
                ELSE (COALESCE(flrptmo.flrpt_ending-flrptprmo.flrpt_ending,0))
        END AS flstmtitem_prmonthdiff,
        CASE
                WHEN ((flhead_type IN ('I','C')) AND (flrptprmo.flrpt_diff > 0)) THEN
                        (COALESCE((flrptmo.flrpt_diff-flrptprmo.flrpt_diff)/flrptprmo.flrpt_diff,0))
                WHEN ((flhead_type = 'B') AND (flrptprmo.flrpt_ending > 0)) THEN
                        (COALESCE((flrptmo.flrpt_ending-flrptprmo.flrpt_ending)/flrptprmo.flrpt_ending,0))
                ELSE NULL
        END AS flstmtitem_prmonthdiffprcnt,
        CASE
                WHEN (flhead_type IN ('I','C')) THEN
                        (COALESCE(flrptprqt.flrpt_diff,0))
                ELSE (COALESCE(flrptprqt.flrpt_ending,0))
        END AS flstmtitem_prqtr,
        CASE
                WHEN (flitem_showdiffprcnt) THEN
                        (flrptprqt.flrpt_diffprcnt)
                WHEN (flitem_showendprcnt) THEN
                        (flrptprqt.flrpt_endingprcnt)
                ELSE NULL
        END AS flstmtitem_prqtrprcnt,
        CASE
                WHEN (flhead_type IN ('I','C')) THEN
                        (COALESCE(flrptqt.flrpt_diff-flrptprqt.flrpt_diff,0))
                ELSE (COALESCE(flrptqt.flrpt_ending-flrptprqt.flrpt_ending,0))
        END AS flstmtitem_prqtrdiff,
        CASE
                WHEN ((flhead_type IN ('I','C')) AND (flrptprqt.flrpt_diff > 0)) THEN
                        (COALESCE((flrptqt.flrpt_diff-flrptprqt.flrpt_diff)/flrptprqt.flrpt_diff,0))
                WHEN ((flhead_type = 'B') AND (flrptprqt.flrpt_ending > 0)) THEN
                        (COALESCE((flrptqt.flrpt_ending-flrptprqt.flrpt_ending)/flrptprqt.flrpt_ending,0))
                ELSE NULL
        END AS flstmtitem_prqtrdiffprcnt,
        CASE
                WHEN (flhead_type IN ('I','C')) THEN
                        (COALESCE(flrptpryr.flrpt_diff,0))
                ELSE (COALESCE(flrptpryr.flrpt_ending,0))
        END AS flstmtitem_pryear,
        CASE
                WHEN (flitem_showdiffprcnt) THEN
                        (flrptpryr.flrpt_diffprcnt)
                WHEN (flitem_showendprcnt) THEN
                        (flrptpryr.flrpt_endingprcnt)
                ELSE NULL
        END AS flstmtitem_pryearprcnt,
        CASE
                WHEN (flhead_type IN ('I','C')) THEN
                        (COALESCE((flrptyr.flrpt_diff-flrptpryr.flrpt_diff),0))
                ELSE (COALESCE((flrptyr.flrpt_ending-flrptpryr.flrpt_ending),0))
        END AS flstmtitem_pryeardiff,
        CASE
                WHEN ((flhead_type IN ('I','C')) AND (flrptpryr.flrpt_diff > 0)) THEN
                        (COALESCE((flrptyr.flrpt_diff-flrptpryr.flrpt_diff)/flrptpryr.flrpt_diff,0))
                WHEN ((flhead_type = 'B' ) AND (flrptpryr.flrpt_ending > 0)) THEN
                        (COALESCE((flrptyr.flrpt_ending-flrptpryr.flrpt_ending)/flrptpryr.flrpt_ending,0))
                ELSE NULL
        END AS flstmtitem_pryeardiffprcnt
        FROM flitem,flhead,
                (SELECT DISTINCT
                        flrpt_flhead_id,
                        flrpt_period_id,
                        flrpt_username,
                        flrpt_order,
                        flrpt_level,
                        flrpt_type,
                        flrpt_type_id,
                        flrpt_parent_id,
                        accnt_id AS flrpt_accnt_id,
                        CASE WHEN (pShowNumbers) THEN
                                (formatGLAccount(accnt_id) || '-' || accnt_descrip)
                        ELSE accnt_descrip END AS flrpt_name
                FROM flrpt,accnt
                WHERE ((flrpt_type='I')
                AND (flrpt_flhead_id=_p.flhead_id)
                AND (flrpt_period_id=pPeriodid)
                AND (accnt_id=flrpt_accnt_id))) AS flrpt
                        LEFT OUTER JOIN flrpt flrptmo
                                ON ((flrptmo.flrpt_type=flrpt.flrpt_type)
                                AND (flrptmo.flrpt_type_id=flrpt.flrpt_type_id)
                                AND (flrptmo.flrpt_flhead_id=flrpt.flrpt_flhead_id)
                                AND (flrptmo.flrpt_period_id=flrpt.flrpt_period_id)
                                AND (flrptmo.flrpt_interval='M')
                                AND (flrptmo.flrpt_order=flrpt.flrpt_order))
                        LEFT OUTER JOIN flrpt flrptqt
                                ON ((flrptqt.flrpt_type=flrpt.flrpt_type)
                                AND (flrptqt.flrpt_type_id=flrpt.flrpt_type_id)
                                AND (flrptqt.flrpt_flhead_id=flrpt.flrpt_flhead_id)
                                AND (flrptqt.flrpt_period_id=flrpt.flrpt_period_id)
                                AND (flrptqt.flrpt_interval=_qtrInterval)
                                AND (flrptqt.flrpt_order=flrpt.flrpt_order))
                        LEFT OUTER JOIN flrpt flrptyr
                                ON ((flrptyr.flrpt_type=flrpt.flrpt_type)
                                AND (flrptyr.flrpt_type_id=flrpt.flrpt_type_id)
                                AND (flrptyr.flrpt_flhead_id=flrpt.flrpt_flhead_id)
                                AND (flrptyr.flrpt_period_id=flrpt.flrpt_period_id)
                                AND (flrptyr.flrpt_interval=_yrInterval)
                                AND (flrptyr.flrpt_order=flrpt.flrpt_order))
                        LEFT OUTER JOIN flrpt flrptprmo
                                ON ((flrptprmo.flrpt_type=flrpt.flrpt_type)
                                AND (flrptprmo.flrpt_type_id=flrpt.flrpt_type_id)
                                AND (flrptprmo.flrpt_flhead_id=flrpt.flrpt_flhead_id)
                                AND (flrptprmo.flrpt_period_id=_priorMoPeriodId)
                                AND (flrptprmo.flrpt_interval='M')
                                AND (flrptprmo.flrpt_order=flrpt.flrpt_order))
                        LEFT OUTER JOIN flrpt flrptprqt
                                ON ((flrptprqt.flrpt_type=flrpt.flrpt_type)
                                AND (flrptprqt.flrpt_type_id=flrpt.flrpt_type_id)
                                AND (flrptprqt.flrpt_flhead_id=flrpt.flrpt_flhead_id)
                                AND (flrptprqt.flrpt_period_id=_priorQtPeriodId)
                                AND (flrptprqt.flrpt_interval='Q')
                                AND (flrptprqt.flrpt_order=flrpt.flrpt_order))
                        LEFT OUTER JOIN flrpt flrptpryr
                                ON ((flrptpryr.flrpt_type=flrpt.flrpt_type)
                                AND (flrptpryr.flrpt_type_id=flrpt.flrpt_type_id)
                                AND (flrptpryr.flrpt_flhead_id=flrpt.flrpt_flhead_id)
                                AND (flrptpryr.flrpt_period_id=_priorYrPeriodId)
                                AND (flrptpryr.flrpt_interval='Y')
                                AND (flrptpryr.flrpt_order=flrpt.flrpt_order) )
        WHERE ((flitem_id = flrpt.flrpt_type_id)
        AND (flhead_id = flitem_flhead_id))
        UNION
        SELECT
        flrpt.flrpt_flhead_id AS flstmtitem_flhead_id,
        flrpt.flrpt_period_id AS flstmtitem_period_id,
        flrpt.flrpt_username AS flstmtitem_username,
        flrpt.flrpt_order AS flstmtitem_order,
        flrpt.flrpt_level AS flstmtitem_level,
        flrpt.flrpt_type AS flstmtitem_type,
        flrpt.flrpt_type_id AS flstmtitem_type_id,
        flrpt.flrpt_parent_id AS flstmtitem_parent_id,
        NULL AS flstmtitem_accnt_id,
        CASE WHEN(flrpt.flrpt_type='T' AND flrpt.flrpt_level=0) THEN
                        COALESCE(flrpt.flrpt_altname, 'Total')
                WHEN(flrpt.flrpt_type='T') THEN
                        formatindent(COALESCE(flrpt.flrpt_altname, 'Subtotal') ,
                        (CASE WHEN pIndentName THEN flrpt.flrpt_level ELSE 0 END))
                ELSE formatindent(('Type ' || flrpt.flrpt_type || ' ' || text(flrpt.flrpt_type_id)),
                        (CASE WHEN pIndentName THEN flrpt.flrpt_level ELSE 0 END))
                END AS flstmtitem_name,
        CASE
                WHEN (flhead_type IN ('I','C')) THEN
                        (COALESCE(flrptmo.flrpt_diff,0))
                ELSE (COALESCE(flrptmo.flrpt_ending,0))
        END AS flstmtitem_month,
        (COALESCE(flrptmo.flrpt_debits,0)) AS flstmtitem_monthdb,
        (COALESCE(flrptmo.flrpt_credits,0)) AS flstmtitem_monthcr,
        CASE
                WHEN (flhead_type IN ('I','C')) THEN
                        (flrptmo.flrpt_diffprcnt)
                ELSE (flrptmo.flrpt_endingprcnt)
        END AS flstmtitem_monthprcnt,
        (COALESCE(flrptmo.flrpt_budget,0)) AS flstmtitem_monthbudget,
        (flrptmo.flrpt_budgetprcnt) AS flstmtitem_monthbudgetprcnt,
        CASE
                WHEN (flhead_type IN ('I','C')) THEN
                        (COALESCE((flrptmo.flrpt_diff-flrptmo.flrpt_budget),0))
                ELSE (COALESCE((flrptmo.flrpt_ending-flrptmo.flrpt_budget),0))
        END AS flstmtitem_monthbudgetdiff,
        CASE
                WHEN ((flhead_type IN ('I','C')) AND (flrptmo.flrpt_budget > 0)) THEN
                        (COALESCE(((flrptmo.flrpt_diff-flrptmo.flrpt_budget)/flrptmo.flrpt_budget),0))
                WHEN ((flhead_type='B') AND (flrptmo.flrpt_budget > 0)) THEN
                        (COALESCE(((flrptmo.flrpt_ending-flrptmo.flrpt_budget)/flrptmo.flrpt_budget),0))
                ELSE NULL
        END AS flstmtitem_monthbudgetdiffprcnt,
        CASE
                WHEN (flhead_type IN ('I','C')) THEN
                        (COALESCE(flrptqt.flrpt_diff,0))
                ELSE (COALESCE(flrptqt.flrpt_ending,0))
        END AS flstmtitem_qtr,
        (COALESCE(flrptqt.flrpt_debits,0)) AS flstmtitem_qtrdb,
        (COALESCE(flrptqt.flrpt_credits,0)) AS flstmtitem_qtrcr,
        CASE
                WHEN (flhead_type IN ('I','C')) THEN
                        (flrptqt.flrpt_diffprcnt)
                ELSE (flrptqt.flrpt_endingprcnt)
        END AS flstmtitem_qtrprcnt,
        (COALESCE(flrptqt.flrpt_budget,0)) AS flstmtitem_qtrbudget,
        (flrptqt.flrpt_budgetprcnt) AS flstmtitem_qtrbudgetprcnt,
        CASE
                WHEN (flhead_type IN ('I','C')) THEN
                        (COALESCE((flrptqt.flrpt_diff-flrptqt.flrpt_budget),0))
                ELSE (COALESCE((flrptqt.flrpt_ending-flrptqt.flrpt_budget),0))
        END AS flstmtitem_qtrbudgetdiff,
        CASE
                WHEN ((flhead_type IN ('I','C')) AND (flrptqt.flrpt_budget > 0)) THEN
                        (COALESCE(((flrptqt.flrpt_diff-flrptqt.flrpt_budget)/flrptqt.flrpt_budget),0))
                WHEN ((flhead_type='B') AND (flrptqt.flrpt_budget > 0)) THEN
                        (COALESCE(((flrptqt.flrpt_ending-flrptqt.flrpt_budget)/flrptqt.flrpt_budget),0))
                ELSE NULL
        END AS flstmtitem_qtrbudgetdiffprcnt,
        CASE
                WHEN (flhead_type IN ('I','C')) THEN
                        (COALESCE(flrptyr.flrpt_diff,0))
                ELSE (COALESCE(flrptyr.flrpt_ending,0))
        END AS flstmtitem_year,
        (COALESCE(flrptyr.flrpt_debits,0)) AS flstmtitem_yeardb,
        (COALESCE(flrptyr.flrpt_credits,0)) AS flstmtitem_yearcr,
        CASE
                WHEN (flhead_type IN ('I','C')) THEN
                        (flrptyr.flrpt_diffprcnt)
                ELSE (flrptyr.flrpt_endingprcnt)
        END AS flstmtitem_yearprcnt,
        (COALESCE(flrptyr.flrpt_budget,0)) AS  flstmtitem_yearbudget,
        (flrptyr.flrpt_budgetprcnt) AS flstmtitem_yearbudgetprcnt,
        CASE
                WHEN (flhead_type IN ('I','C')) THEN
                        (COALESCE((flrptyr.flrpt_diff-flrptyr.flrpt_budget),0))
                ELSE (COALESCE((flrptyr.flrpt_ending-flrptyr.flrpt_budget),0))
        END AS flstmtitem_yearbudgetdiff,
        CASE
                WHEN ((flhead_type IN ('I','C')) AND (flrptyr.flrpt_budget > 0)) THEN
                        (COALESCE(((flrptyr.flrpt_diff-flrptyr.flrpt_budget)/flrptyr.flrpt_budget),0))
                WHEN ((flhead_type = 'B') AND (flrptyr.flrpt_budget > 0)) THEN
                        (COALESCE(((flrptyr.flrpt_ending-flrptyr.flrpt_budget)/flrptyr.flrpt_budget),0))
                ELSE NULL
        END AS flstmtitem_yearbudgetdiffprcnt,
        CASE
                WHEN (flhead_type IN ('I','C')) THEN
                        (COALESCE(flrptprmo.flrpt_diff,0))
                ELSE (COALESCE(flrptprmo.flrpt_ending,0))
        END AS flstmtitem_prmonth,
        CASE
                WHEN (flhead_type IN ('I','C')) THEN
                        (flrptprmo.flrpt_diffprcnt)
                ELSE (flrptprmo.flrpt_endingprcnt)
        END AS flstmtitem_prmonthprcnt,
        CASE
                WHEN (flhead_type IN ('I','C')) THEN
                        (COALESCE(flrptmo.flrpt_diff-flrptprmo.flrpt_diff,0))
                ELSE (COALESCE(flrptmo.flrpt_ending-flrptprmo.flrpt_ending,0))
        END AS flstmtitem_prmonthdiff,
        CASE
                WHEN ((flhead_type IN ('I','C')) AND (flrptprmo.flrpt_diff > 0)) THEN
                        (COALESCE((flrptmo.flrpt_diff-flrptprmo.flrpt_diff)/flrptprmo.flrpt_diff,0))
                WHEN ((flhead_type = 'B') AND (flrptprmo.flrpt_ending > 0)) THEN
                        (COALESCE((flrptmo.flrpt_ending-flrptprmo.flrpt_ending)/flrptprmo.flrpt_ending,0))
                ELSE NULL
        END AS flstmtitem_prmonthdiffprcnt,
        CASE
                WHEN (flhead_type IN ('I','C')) THEN
                        (COALESCE(flrptprqt.flrpt_diff,0))
                ELSE (COALESCE(flrptprqt.flrpt_ending,0))
        END AS flstmtitem_prqtr,
        CASE
                WHEN (flhead_type IN ('I','C')) THEN
                        (flrptprqt.flrpt_diffprcnt)
                ELSE (flrptprqt.flrpt_endingprcnt)
        END AS flstmtitem_prqtrprcnt,
        CASE
                WHEN (flhead_type IN ('I','C')) THEN
                        (COALESCE(flrptqt.flrpt_diff-flrptprqt.flrpt_diff,0))
                ELSE (COALESCE(flrptqt.flrpt_ending-flrptprqt.flrpt_ending,0))
        END AS flstmtitem_prqtrdiff,
        CASE
                WHEN ((flhead_type IN ('I','C')) AND (flrptprqt.flrpt_diff > 0)) THEN
                        (COALESCE((flrptqt.flrpt_diff-flrptprqt.flrpt_diff)/flrptprqt.flrpt_diff,0))
                WHEN ((flhead_type = 'B') AND (flrptprqt.flrpt_ending > 0)) THEN
                        (COALESCE((flrptqt.flrpt_ending-flrptprqt.flrpt_ending)/flrptprqt.flrpt_ending,0))
                ELSE NULL
        END AS flstmtitem_prqtrdiffprcnt,
        CASE
                WHEN (flhead_type IN ('I','C')) THEN
                        (COALESCE(flrptpryr.flrpt_diff,0))
                ELSE (COALESCE(flrptpryr.flrpt_ending,0))
        END AS flstmtitem_pryear,
        CASE
                WHEN (flhead_type IN ('I','C')) THEN
                        (flrptpryr.flrpt_diffprcnt)
                ELSE (flrptpryr.flrpt_endingprcnt)
        END AS flstmtitem_pryearprcnt,
        CASE
                WHEN (flhead_type IN ('I','C')) THEN
                        (COALESCE(flrptyr.flrpt_diff-flrptpryr.flrpt_diff,0))
                ELSE (COALESCE(flrptyr.flrpt_ending-flrptpryr.flrpt_ending,0))
        END AS flstmtitem_pryeardiff,
        CASE
                WHEN ((flhead_type IN ('I','C')) AND (flrptpryr.flrpt_diff > 0)) THEN
                        (COALESCE((flrptyr.flrpt_diff-flrptpryr.flrpt_diff)/flrptpryr.flrpt_diff,0))
                WHEN ((flhead_type = 'B' ) AND (flrptpryr.flrpt_ending > 0)) THEN
                        (COALESCE((flrptyr.flrpt_ending-flrptpryr.flrpt_ending)/flrptpryr.flrpt_ending,0))
                ELSE NULL
        END AS flstmtitem_pryeardiffprcnt
        FROM flhead CROSS JOIN (SELECT DISTINCT
                        flrpt_flhead_id,
                        flrpt_period_id,
                        flrpt_username,
                        flrpt_order,
                        flrpt_level,
                        flrpt_type,
                        flrpt_type_id,
                        flrpt_parent_id,
                        flrpt_altname
                FROM flrpt
                WHERE ((NOT (flrpt_type IN ('G','I','S')))
                AND (flrpt_flhead_id=_p.flhead_id)
                AND (flrpt_period_id=pPeriodId)
                )) AS flrpt
                        LEFT OUTER JOIN flrpt flrptmo
                                ON ((flrptmo.flrpt_type=flrpt.flrpt_type)
                                AND (flrptmo.flrpt_order=flrpt.flrpt_order)
                                AND (flrptmo.flrpt_flhead_id=flrpt.flrpt_flhead_id)
                                AND (flrptmo.flrpt_period_id=flrpt.flrpt_period_id)
                                AND (flrptmo.flrpt_interval='M')
                                )
                        LEFT OUTER JOIN flrpt flrptqt
                                ON ((flrptqt.flrpt_type=flrpt.flrpt_type)
                                AND (flrptqt.flrpt_order=flrpt.flrpt_order)
                                AND (flrptqt.flrpt_flhead_id=flrpt.flrpt_flhead_id)
                                AND (flrptqt.flrpt_period_id=flrpt.flrpt_period_id)
                                AND (flrptqt.flrpt_interval=_qtrInterval)
                                )
                        LEFT OUTER JOIN flrpt flrptyr
                                ON ((flrptyr.flrpt_type=flrpt.flrpt_type)
                                AND (flrptyr.flrpt_order=flrpt.flrpt_order)
                                AND (flrptyr.flrpt_flhead_id=flrpt.flrpt_flhead_id)
                                AND (flrptyr.flrpt_period_id=flrpt.flrpt_period_id)
                                AND (flrptyr.flrpt_interval=_yrInterval)
                                )
                        LEFT OUTER JOIN flrpt flrptprmo
                                ON ((flrptprmo.flrpt_type=flrpt.flrpt_type)
                                AND (flrptprmo.flrpt_order=flrpt.flrpt_order)
                                AND (flrptprmo.flrpt_flhead_id=flrpt.flrpt_flhead_id)
                                AND (flrptprmo.flrpt_period_id=_priorMoPeriodId)
                                AND (flrptprmo.flrpt_interval='M')
                                )
                        LEFT OUTER JOIN flrpt flrptprqt
                                ON ((flrptprqt.flrpt_type=flrpt.flrpt_type)
                                AND (flrptprqt.flrpt_order=flrpt.flrpt_order)
                                AND (flrptprqt.flrpt_flhead_id=flrpt.flrpt_flhead_id)
                                AND (flrptprqt.flrpt_period_id=_priorQtPeriodId)
                                AND (flrptprqt.flrpt_interval='Q')
                                )
                        LEFT OUTER JOIN flrpt flrptpryr
                                ON ((flrptpryr.flrpt_type=flrpt.flrpt_type)
                                AND (flrptpryr.flrpt_order=flrpt.flrpt_order)
                                AND (flrptpryr.flrpt_flhead_id=flrpt.flrpt_flhead_id)
                                AND (flrptpryr.flrpt_period_id=_priorYrPeriodId)
                                AND (flrptpryr.flrpt_interval='Y')
                                )
        WHERE (flhead_id=flrpt.flrpt_flhead_id)
        ORDER BY flstmtitem_order
        LOOP
                IF _prevlevel > _x.flstmtitem_level THEN
                        _subgrp := _subgrp+1;
                END IF;
                _prevlevel:=_x.flstmtitem_level;
                _row.flstmtitem_subgrp := _subgrp;

                IF NOT _first THEN
                        RETURN NEXT _row;
                END IF;

                _first := FALSE;

                _row.flstmtitem_flhead_id := _x.flstmtitem_flhead_id;
                _row.flstmtitem_period_id := _x.flstmtitem_period_id;
                _row.flstmtitem_username := _x.flstmtitem_username;
                _row.flstmtitem_order := _x.flstmtitem_order;
                _row.flstmtitem_level := _x.flstmtitem_level;
                _row.flstmtitem_type := _x.flstmtitem_type;
                _row.flstmtitem_type_id := _x.flstmtitem_type_id;
                _row.flstmtitem_parent_id := _x.flstmtitem_parent_id;
                _row.flstmtitem_accnt_id := _x.flstmtitem_accnt_id;
                _row.flstmtitem_name := _x.flstmtitem_name;
                _row.flstmtitem_month := _x.flstmtitem_month;
                _row.flstmtitem_monthdb := _x.flstmtitem_monthdb;
                _row.flstmtitem_monthcr := _x.flstmtitem_monthcr;
                _row.flstmtitem_monthprcnt := _x.flstmtitem_monthprcnt;
                _row.flstmtitem_monthbudget := _x.flstmtitem_monthbudget;
                _row.flstmtitem_monthbudgetprcnt := _x.flstmtitem_monthbudgetprcnt;
                _row.flstmtitem_monthbudgetdiff := _x.flstmtitem_monthbudgetdiff;
                _row.flstmtitem_monthbudgetdiffprcnt := _x.flstmtitem_monthbudgetdiffprcnt;
                _row.flstmtitem_qtr := _x.flstmtitem_qtr;
                _row.flstmtitem_qtrdb := _x.flstmtitem_qtrdb;
                _row.flstmtitem_qtrcr := _x.flstmtitem_qtrcr;
                _row.flstmtitem_qtrprcnt := _x.flstmtitem_qtrprcnt;
                _row.flstmtitem_qtrbudget := _x.flstmtitem_qtrbudget;
                _row.flstmtitem_qtrbudgetprcnt := _x.flstmtitem_qtrbudgetprcnt;
                _row.flstmtitem_qtrbudgetdiff := _x.flstmtitem_qtrbudgetdiff;
                _row.flstmtitem_qtrbudgetdiffprcnt := _x.flstmtitem_qtrbudgetdiffprcnt;
                _row.flstmtitem_year := _x.flstmtitem_year;
                _row.flstmtitem_yeardb := _x.flstmtitem_yeardb;
                _row.flstmtitem_yearcr := _x.flstmtitem_yearcr;
                _row.flstmtitem_yearprcnt := _x.flstmtitem_yearprcnt;
                _row.flstmtitem_yearbudget := _x.flstmtitem_yearbudget;
                _row.flstmtitem_yearbudgetprcnt := _x.flstmtitem_yearbudgetprcnt;
                _row.flstmtitem_yearbudgetdiff := _x.flstmtitem_yearbudgetdiff;
                _row.flstmtitem_yearbudgetdiffprcnt := _x.flstmtitem_yearbudgetdiffprcnt;
                _row.flstmtitem_prmonth := _x.flstmtitem_prmonth;
                _row.flstmtitem_prmonthprcnt := _x.flstmtitem_prmonthprcnt;
                _row.flstmtitem_prmonthdiff := _x.flstmtitem_prmonthdiff;
                _row.flstmtitem_prmonthdiffprcnt := _x.flstmtitem_prmonthdiffprcnt;
                _row.flstmtitem_prqtr := _x.flstmtitem_prqtr;
                _row.flstmtitem_prqtrprcnt := _x.flstmtitem_prqtrprcnt;
                _row.flstmtitem_prqtrdiff := _x.flstmtitem_prqtrdiff;
                _row.flstmtitem_prqtrdiffprcnt := _x.flstmtitem_prqtrdiffprcnt;
                _row.flstmtitem_pryear := _x.flstmtitem_pryear;
                _row.flstmtitem_pryearprcnt := _x.flstmtitem_pryearprcnt;
                _row.flstmtitem_pryeardiff := _x.flstmtitem_pryeardiff;
                _row.flstmtitem_pryeardiffprcnt := _x.flstmtitem_pryeardiffprcnt;

        END LOOP;

        _row.flstmtitem_subgrp := _subgrp + 1;
        RETURN NEXT _row;
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION financialreport(INTEGER,_int4,bpchar,bool,INTEGER)
  RETURNS SETOF fltrenditem AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pFlheadId ALIAS FOR $1;
  pPeriodIds ALIAS FOR $2;
  pInterval ALIAS FOR $3;
  pShowNumbers ALIAS FOR $4;
  pPrjid ALIAS FOR $5;
  _row fltrenditem%ROWTYPE;
  _type CHAR;
  _p RECORD;
  _count INTEGER;
  _n NUMERIC;
  _fld NUMERIC[];
  _grndttl NUMERIC;
  _i INTEGER;
  _first BOOLEAN;
  _prevlevel INTEGER;
  _subgrp INTEGER;

BEGIN
        _first := true;
        _subgrp := 0;

        IF ARRAY_UPPER(pPeriodIds,1) <= 12 THEN
                _count := ARRAY_UPPER(pPeriodIds,1);
        ELSE
                _count := 12;
        END IF;

        --Get Type
        SELECT flhead_type FROM flhead INTO _type WHERE flhead_id=pFlheadId;

        --Build Financial Data
        FOR _i IN 1.._count
        LOOP
                PERFORM financialreport(pFlheadId,pPeriodIds[_i],pInterval,pPrjid);
        END LOOP;

        --Get Row Data
        FOR _p IN
        SELECT flrpt_flhead_id,
                flrpt_username,
                flrpt_order,
                flrpt_level,
                flrpt_type,
                flrpt_type_id,
                flrpt_parent_id,
                flrpt_accnt_id,
                formatindent(flgrp.flgrp_name,flrpt.flrpt_level) AS flrpt_name,
                CASE
                        WHEN (flgrp_summarize AND (_type IN ('I','C'))) THEN
                                (COALESCE(flrpt_diff,0))
                        WHEN (flgrp_summarize AND (_type = 'B')) THEN
                                (COALESCE(flrpt_ending,0))
                        ELSE NULL
                END AS f_fld1,
                flgrp_summarize AS display
        FROM flrpt,flgrp
        WHERE ((flrpt_flhead_id=pFlheadId)
        AND (flgrp_id=flrpt_type_id)
        AND (flrpt_type='G')
        AND (flrpt_period_id=pPeriodIds[1])
        AND (flrpt_interval=pInterval)
        )
        UNION
        SELECT flrpt_flhead_id,
                flrpt_username,
                flrpt_order,
                flrpt_level,
                flrpt_type,
                flrpt_type_id,
                flrpt_parent_id,
                flrpt_accnt_id,
                formatindent(accnt_descrip,flrpt.flrpt_level) AS flrpt_name,
                CASE
                        WHEN (_type IN ('I','C')) THEN
                                (COALESCE(flrpt_diff,0))
                        WHEN (_type = 'B') THEN
                                (COALESCE(flrpt_ending,0))
                        ELSE NULL
                END AS f_fld1,
                true AS display
        FROM flrpt,flitem,accnt
        WHERE ((flrpt_flhead_id=pFlheadId)
        AND (flrpt_accnt_id=accnt_id)
        AND (flitem_id=flrpt_type_id)
        AND (flrpt_type='I')
        AND (flrpt_period_id=pPeriodIds[1])
        AND (flrpt_interval=pInterval)
        )
        UNION
        SELECT flrpt_flhead_id,
                flrpt_username,
                flrpt_order,
                flrpt_level,
                flrpt_type,
                flrpt_type_id,
                flrpt_parent_id,
                flrpt_accnt_id,
                CASE
                        WHEN (flrpt.flrpt_type='T' AND flrpt.flrpt_level=0) THEN
                                COALESCE(flrpt.flrpt_altname, 'Total')
                        WHEN (flrpt.flrpt_type='T') THEN
                                formatindent(COALESCE(flrpt.flrpt_altname, 'Subtotal') ,flrpt.flrpt_level) 

                        ELSE
                                formatindent(('Type ' || flrpt.flrpt_type || ' ' || text(flrpt.flrpt_type_id)), flrpt.flrpt_level)
                END AS flstmtitem_name,
                CASE
                        WHEN (_type IN ('I','C')) THEN
                                (COALESCE(flrpt_diff,0))
                        WHEN (_type = 'B') THEN
                                (COALESCE(flrpt_ending,0))
                        ELSE NULL
                END AS f_fld1,
                true AS display
        FROM flrpt
        WHERE ((flrpt_flhead_id=pFlheadId)
        AND (flrpt_type NOT IN ('I','S','G'))
        AND (flrpt_period_id=pPeriodIds[1])
        AND (flrpt_interval=pInterval)
        )
        ORDER BY flrpt_order
        LOOP

                IF _type IN ('I','C') THEN
                        _grndttl := _p.f_fld1;
                END IF;

                --Loop through and calculate period column values
                IF (_p.display) THEN
                        FOR _i IN 2.._count
                        LOOP
                                SELECT
                                CASE
                                        WHEN (_type IN ('I','C')) THEN
                                                COALESCE(flrpt_diff,0)
                                        WHEN (_type = 'B') THEN
                                                COALESCE(flrpt_ending,0)
                                        ELSE NULL
                                END INTO _n
                                FROM flrpt
                                WHERE ((flrpt_flhead_id=pFlheadId)
                                AND (flrpt_period_id=pPeriodIds[_i])
                                AND (flrpt_interval=pInterval)
                                AND (flrpt_order=_p.flrpt_order));
                                _fld[_i-1] := _n;
                                IF _type IN ('I','C') THEN
                                        _grndttl := _grndttl+_n;
                                END IF;
                        END LOOP;
                END IF;

                --Send it all back to the caller
                IF _prevlevel > _p.flrpt_level THEN
                        _subgrp := _subgrp+1;
                END IF;
                _prevlevel:=_p.flrpt_level;
                _row.fltrenditem_subgrp := _subgrp;

                IF NOT _first THEN
                        RETURN NEXT _row;
                END IF;

                _first := FALSE;

                _row.fltrenditem_flhead_id := _p.flrpt_flhead_id;
                _row.fltrenditem_username := _p.flrpt_username;
                _row.fltrenditem_order := _p.flrpt_order;
                _row.fltrenditem_level := _p.flrpt_level;
                _row.fltrenditem_type := _p.flrpt_type;
                _row.fltrenditem_type_id := _p.flrpt_type_id;
                _row.fltrenditem_parent_id := _p.flrpt_parent_id;
                _row.fltrenditem_accnt_id := _p.flrpt_accnt_id;
                _row.fltrenditem_name := _p.flrpt_name;
                IF (_p.display) THEN
                        _row.fltrenditem_fld1 := (_p.f_fld1);
                        _row.fltrenditem_fld2 := (_fld[1]);
                        _row.fltrenditem_fld3 := (_fld[2]);
                        _row.fltrenditem_fld4 := (_fld[3]);
                        _row.fltrenditem_fld5 := (_fld[4]);
                        _row.fltrenditem_fld6 := (_fld[5]);
                        _row.fltrenditem_fld7 := (_fld[6]);
                        _row.fltrenditem_fld8 := (_fld[7]);
                        _row.fltrenditem_fld9 := (_fld[8]);
                        _row.fltrenditem_fld10 := (_fld[9]);
                        _row.fltrenditem_fld11 := (_fld[10]);
                        _row.fltrenditem_fld12 := (_fld[11]);
                        _row.fltrenditem_grndttl := (_grndttl);
                ELSE
                        _row.fltrenditem_fld1 := NULL;
                        _row.fltrenditem_fld2 := NULL;
                        _row.fltrenditem_fld3 := NULL;
                        _row.fltrenditem_fld4 := NULL;
                        _row.fltrenditem_fld5 := NULL;
                        _row.fltrenditem_fld6 := NULL;
                        _row.fltrenditem_fld7 := NULL;
                        _row.fltrenditem_fld8 := NULL;
                        _row.fltrenditem_fld9 := NULL;
                        _row.fltrenditem_fld10 := NULL;
                        _row.fltrenditem_fld11 := NULL;
                        _row.fltrenditem_fld12 := NULL;
                        _row.fltrenditem_grndttl := NULL;
                END IF;

        END LOOP;

        _row.fltrenditem_subgrp := _subgrp + 1;
        RETURN NEXT _row;

END;
$$ LANGUAGE 'plpgsql';
