SELECT dropIfExists('FUNCTION', 'insertFlGroup(INTEGER, INTEGER, INTEGER, INTEGER, BOOLEAN)');
SELECT dropIfExists('FUNCTION', 'insertFlGroup(INTEGER, INTEGER, INTEGER, INTEGER, BOOLEAN, CHAR)');
SELECT dropIfExists('FUNCTION', 'insertFlGroup(INTEGER, INTEGER, INTEGER, INTEGER, BOOLEAN, CHAR, INTEGER)');

CREATE OR REPLACE FUNCTION insertflgroup(pFlheadid INTEGER
                                       , pPeriodid INTEGER
                                       , pFlgrpid INTEGER
                                       , pLevel INTEGER
                                       , pSummarize BOOLEAN
                                       , pInterval CHAR DEFAULT NULL
                                       , pPrjid INTEGER DEFAULT NULL) RETURNS BOOLEAN AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.

/* see the "performance vs. history" comment in financialreport() */
DECLARE
  _subtotal BOOLEAN;
  _r RECORD;
  _g RECORD;
  _all BOOLEAN;
  _username TEXT := getEffectiveXtUser();

BEGIN

  _all = COALESCE(pPrjid,-1) = -1;
  
-- Check to see if this group wants a subtotal
  _subtotal := FALSE;
  IF (pFlgrpid != -1) THEN
    SELECT COALESCE(flgrp_subtotal, FALSE) INTO _subtotal
      FROM flgrp
     WHERE ((flgrp_flhead_id=pFlheadid)
       AND  (flgrp_id=pFlgrpid));
  END IF;

  FOR _r IN SELECT 'G' AS type, flgrp_id AS type_id,
                   flgrp_order AS orderby,
                   flgrp_summarize AS summarize,
                   flgrp_subtract AS subtract,
                   CASE WHEN(flgrp_summarize AND (NOT flgrp_showstart)) THEN NULL
                        ELSE 0.00
                   END AS beginning,
                   CASE WHEN(flgrp_summarize AND (NOT flgrp_showend)) THEN NULL
                        ELSE 0.00
                   END AS ending,
                   CASE WHEN(flgrp_summarize AND (NOT flgrp_showdelta)) THEN NULL
                        ELSE 0.00
                   END AS debits,
                   CASE WHEN(flgrp_summarize AND (NOT flgrp_showdelta)) THEN NULL
                        ELSE 0.00
                   END AS credits,
                   CASE WHEN(flgrp_summarize AND (NOT flgrp_showbudget)) THEN NULL
                        ELSE 0.00
                   END AS budget,
                   CASE WHEN(flgrp_summarize AND (NOT flgrp_showdiff)) THEN NULL
                        ELSE 0.00
                   END AS diff,
                   CASE WHEN(flgrp_summarize AND (NOT flgrp_showcustom)) THEN NULL
                        ELSE 0.00
                   END AS custom,
                   CASE WHEN(flgrp_showstartprcnt) THEN 0.00
                        ELSE NULL
                   END AS beginningprcnt,
                   CASE WHEN(flgrp_showendprcnt) THEN 0.00
                        ELSE NULL
                   END AS endingprcnt,
                   CASE WHEN(flgrp_showdeltaprcnt) THEN 0.00
                        ELSE NULL
                   END AS debitsprcnt,
                   CASE WHEN(flgrp_showdeltaprcnt) THEN 0.00
                        ELSE NULL
                   END AS creditsprcnt,
                   CASE WHEN(flgrp_showbudgetprcnt) THEN 0.00
                        ELSE NULL
                   END AS budgetprcnt,
                   CASE WHEN(flgrp_showdiffprcnt) THEN 0.00
                        ELSE NULL
                   END AS diffprcnt,
                   CASE WHEN(flgrp_showcustomprcnt) THEN 0.00
                        ELSE NULL
                   END AS customprcnt,
                   -1 AS accnt_id,
                   '' AS accnt_number
              FROM flgrp
             WHERE ((flgrp_flgrp_id=pFlgrpid)
               AND  (flgrp_flhead_id=pFlheadid))
             UNION ALL
            SELECT 'I' AS type, flitem_id AS type_id,
                   flitem_order AS orderby,
                   FALSE AS summarize,
                   flitem_subtract AS subtract,
                   CASE WHEN (flitem_showstart AND (first_trialbal_id IS NULL)) THEN 0.00
                        WHEN (flitem_showstart) THEN normalizeTrialBal(first_trialbal_id, 'B')
                        ELSE NULL
                   END AS beginning,
                   CASE WHEN (flitem_showend AND (last_trialbal_id IS NULL)) THEN 0.00
                        WHEN (flitem_showend) THEN normalizeTrialBal(last_trialbal_id, 'E')
                        ELSE NULL
                   END AS ending,
                   CASE WHEN (flitem_showdelta) THEN sum_trialbal_debits
                        ELSE NULL
                   END AS debits,
                   CASE WHEN (flitem_showdelta) THEN sum_trialbal_credits
                        ELSE NULL
                   END AS credits,
                   CASE WHEN ((flitem_showbudget) AND (accnt_type IN ('R','E')) AND flhead_type IN ('I','C','A')) THEN COALESCE(sum_budget_amount,0)
                        WHEN ((flitem_showbudget) AND (accnt_type IN ('R','E')) AND flhead_type = 'B' ) THEN
                                (SELECT COALESCE(SUM(b.budget_amount),0)
                                FROM budget b,
                                        (SELECT ytd.period_id AS ytd_period_id
                                        FROM period cp, period ytd
                                        WHERE ((cp.period_id = last_flitem_period_id)
                                        AND (ytd.period_start <= cp.period_start)
                                AND (ytd.period_yearperiod_id = cp.period_yearperiod_id))) AS periods
                                WHERE ((b.budget_accnt_id=accnt_id)
                                AND (b.budget_period_id=ytd_period_id)))
                        WHEN ((flitem_showbudget) AND (accnt_type IN ('A','L','Q')) AND flhead_type = 'C') THEN calccashbudget(accnt_id,last_flitem_period_id,pInterval)
                        ELSE COALESCE(last_budget_amount,0)
                   END AS budget,
                   CASE WHEN (flitem_showdiff AND (first_trialbal_id IS NULL)) THEN 0.00
                        WHEN (flitem_showdiff) THEN COALESCE(normalizeTrialBal(last_trialbal_id, 'E') - normalizeTrialBal(first_trialbal_id, 'B'), 0.00)
                        ELSE NULL
                   END AS diff,
                   CASE WHEN (NOT flitem_showcustom) THEN NULL
                        WHEN (flitem_custom_source='S' AND (first_trialbal_id IS NOT NULL)) THEN normalizeTrialBal(first_trialbal_id, 'B')
                        WHEN (flitem_custom_source='E' AND (first_trialbal_id IS NOT NULL)) THEN normalizeTrialBal(last_trialbal_id, 'E')
                        WHEN (flitem_custom_source='D') THEN sum_trialbal_debits
                        WHEN (flitem_custom_source='C') THEN sum_trialbal_credits
                        WHEN (flitem_custom_source='B') THEN (
                                CASE
                                  WHEN (accnt_type IN ('R','E')) THEN sum_budget_amount
                                  ELSE last_budget_amount
                                END)
                        WHEN (flitem_custom_source='F' AND  (first_trialbal_id IS NOT NULL)) THEN COALESCE(normalizeTrialBal(last_trialbal_id, 'E') - normalizeTrialBal(first_trialbal_id, 'B'), 0.00)
                        ELSE 0.00
                   END AS custom,
                   CASE WHEN(flitem_showstartprcnt) THEN 0.00
                        ELSE NULL
                   END AS beginningprcnt,
                   CASE WHEN(flitem_showendprcnt) THEN 0.00
                        ELSE NULL
                   END AS endingprcnt,
                   CASE WHEN(flitem_showdeltaprcnt) THEN 0.00
                        ELSE NULL
                   END AS debitsprcnt,
                   CASE WHEN(flitem_showdeltaprcnt) THEN 0.00
                        ELSE NULL
                   END AS creditsprcnt,
                   CASE WHEN(flitem_showbudgetprcnt) THEN 0.00
                        ELSE NULL
                   END AS budgetprcnt,
                   CASE WHEN(flitem_showdiffprcnt) THEN 0.00
                        ELSE NULL
                   END AS diffprcnt,
                   CASE WHEN(flitem_showcustomprcnt) THEN 0.00
                        ELSE NULL
                   END AS customprcnt,
                   accnt_id,
                   public.formatglaccount(accnt_id) AS accnt_number
              FROM
                (SELECT 
                  flhead_type,flitem_id,flitem_order,flitem_subtract,flitem_showstart,flitem_showend,
                  flitem_showdelta,flitem_showbudget,flitem_showdiff,flitem_showcustom,
                  flitem_custom_source,flitem_showstartprcnt,flitem_showendprcnt,flitem_showdeltaprcnt,
                  flitem_showbudgetprcnt,flitem_showdiffprcnt,flitem_showcustomprcnt,
                  accnt_id,accnt_type,
                  FIRST(trialbal_id) AS first_trialbal_id, LAST(trialbal_id) AS last_trialbal_id,
                  SUM(trialbal_debits) AS sum_trialbal_debits, SUM(trialbal_credits) AS sum_trialbal_credits, 
                  LAST(flitem_period_id) AS last_flitem_period_id,
                  SUM(budget_amount) AS sum_budget_amount, LAST(budget_amount) AS last_budget_amount
                  FROM
                (SELECT period_id AS flitem_period_id, period_start,flhead_type,flitem_id,flitem_order,flitem_subtract,flitem_showstart,flitem_showend,
                        flitem_showdelta,flitem_showbudget,flitem_showdiff,flitem_showcustom,
                        flitem_custom_source,flitem_showstartprcnt,flitem_showendprcnt,flitem_showdeltaprcnt,
                        flitem_showbudgetprcnt,flitem_showdiffprcnt,flitem_showcustomprcnt,
                        accnt_id,accnt_type,COALESCE(trialbal_id,getlasttrialbalid(accnt_id,period_id)) as trialbal_id,COALESCE(trialbal_debits,0) as trialbal_debits,
                        COALESCE(trialbal_credits,0) AS trialbal_credits,COALESCE(budget_amount,0) AS budget_amount
                   FROM (SELECT period_id, period_start, flhead_type, flitem_id,flitem_order,flitem_subtract,flitem_showstart,flitem_showend,
                                flitem_showdelta,flitem_showbudget,flitem_showdiff,flitem_showcustom,flitem_custom_source,flitem_showstartprcnt,
                                flitem_showendprcnt,flitem_showdeltaprcnt,flitem_showbudgetprcnt,flitem_showdiffprcnt,flitem_showcustomprcnt,
                                accnt_id, accnt_type
                        FROM  period,flaccnt
                        WHERE ((flitem_flhead_id=pFlheadid)
                        AND (flitem_flgrp_id=pFlgrpid)
                        AND (_all OR prj_id=pPrjId)
                        AND (period_id IN  (SELECT * FROM getperiodid(pPeriodId,pInterval))))
                        ORDER BY flitem_id
                        ) AS flitem
                   LEFT OUTER JOIN trialbal
                     ON ((trialbal_accnt_id=accnt_id)
                     AND (trialbal_period_id=period_id))
                   LEFT OUTER JOIN budget
                     ON ((budget_accnt_id=accnt_id)
                     AND (budget_period_id=period_id))
             ORDER BY accnt_id, period_start) AS data
             GROUP BY flhead_type,flitem_id,flitem_order,flitem_subtract,flitem_showstart,flitem_showend,
                flitem_showdelta,flitem_showbudget,flitem_showdiff,flitem_showcustom,
                flitem_custom_source,flitem_showstartprcnt,flitem_showendprcnt,flitem_showdeltaprcnt,
                flitem_showbudgetprcnt,flitem_showdiffprcnt,flitem_showcustomprcnt,accnt_id,accnt_type) AS agg
             UNION ALL
            SELECT 'S' AS type, flspec_id AS type_id,
                   flspec_order AS orderby,
                   FALSE AS summarize,
                   flspec_subtract AS subtract,
                   CASE WHEN (flspec_showstart) THEN findSpecialFinancial('S', flspec_type, pPeriodid)
                        ELSE NULL
                   END AS beginning,
                   CASE WHEN (flspec_showend) THEN findSpecialFinancial('E', flspec_type, pPeriodid)
                        ELSE NULL
                   END AS ending,
                   CASE WHEN (flspec_showdelta) THEN findSpecialFinancial('D', flspec_type, pPeriodid)
                        ELSE NULL
                   END AS debits,
                   CASE WHEN (flspec_showdelta) THEN findSpecialFinancial('C', flspec_type, pPeriodid)
                        ELSE NULL
                   END AS credits,
                   CASE WHEN (flspec_showbudget) THEN findSpecialFinancial('B', flspec_type, pPeriodid)
                        ELSE NULL
                   END AS budget,
                   CASE WHEN (flspec_showdiff) THEN findSpecialFinancial('E', flspec_type, pPeriodid) - findSpecialFinancial('S', flspec_type, pPeriodid)
                        ELSE NULL
                   END AS diff,
                   CASE WHEN (NOT flspec_showcustom) THEN NULL
                        WHEN (flspec_custom_source='F') THEN findSpecialFinancial('E', flspec_type, pPeriodid) - findSpecialFinancial('S', flspec_type, pPeriodid)
                        WHEN (flspec_custom_source IN ('S', 'E', 'D', 'C', 'B')) THEN findSpecialFinancial(flspec_custom_source, flspec_type, pPeriodid)
                        ELSE 0.00
                   END AS custom,
                   CASE WHEN(flspec_showstartprcnt) THEN 0.00
                        ELSE NULL
                   END AS beginningprcnt,
                   CASE WHEN(flspec_showendprcnt) THEN 0.00
                        ELSE NULL
                   END AS endingprcnt,
                   CASE WHEN(flspec_showdeltaprcnt) THEN 0.00
                        ELSE NULL
                   END AS debitsprcnt,
                   CASE WHEN(flspec_showdeltaprcnt) THEN 0.00
                        ELSE NULL
                   END AS creditsprcnt,
                   CASE WHEN(flspec_showbudgetprcnt) THEN 0.00
                        ELSE NULL
                   END AS budgetprcnt,
                   CASE WHEN(flspec_showdiffprcnt) THEN 0.00
                        ELSE NULL
                   END AS diffprcnt,
                   CASE WHEN(flspec_showcustomprcnt) THEN 0.00
                        ELSE NULL
                   END AS customprcnt,
                   -1 AS accnt_id,
                   '' AS accnt_number
              FROM flspec
             WHERE ((flspec_flgrp_id=pFlgrpid)
               AND  (flspec_flhead_id=pFlheadid))
          ORDER BY orderby, accnt_number LOOP

    IF (_r.type = 'G') THEN

-- Create a record for the items sub items to be attached to and be able to update the total
      INSERT INTO flrpt
             (flrpt_flhead_id, flrpt_period_id, flrpt_username,
              flrpt_order,
              flrpt_level, flrpt_type, flrpt_type_id,
              flrpt_beginning, flrpt_ending,
              flrpt_debits, flrpt_credits, flrpt_budget, flrpt_diff, flrpt_custom,
              flrpt_beginningprcnt, flrpt_endingprcnt,
              flrpt_debitsprcnt, flrpt_creditsprcnt, flrpt_budgetprcnt, flrpt_diffprcnt, flrpt_customprcnt,
              flrpt_parent_id, flrpt_interval)
      VALUES (pFlheadid, pPeriodid, _username,
              (COALESCE(( SELECT MAX(flrpt_order)
                            FROM flrpt
                           WHERE ((flrpt_flhead_id=pFlheadid)
                             AND  (flrpt_period_id=pPeriodid)
                             AND (flrpt_interval=pInterval)
--                           AND  (flrpt_username=_username)
                             )
                        ), 1) + 1),
              pLevel, _r.type, _r.type_id,
              _r.beginning, _r.ending,
              _r.debits, _r.credits, _r.budget, _r.diff, _r.custom,
              _r.beginningprcnt, _r.endingprcnt,
              _r.debitsprcnt, _r.creditsprcnt, _r.budgetprcnt, _r.diffprcnt, _r.customprcnt,
              pFlgrpid, pInterval);

      PERFORM insertFlGroup(pFlheadid, pPeriodid, _r.type_id, (pLevel + 1), (pSummarize OR _r.summarize), pInterval, pPrjid);

-- Update the parent item
      SELECT COALESCE(flrpt_beginning, 0.00) AS beginning,
             COALESCE(flrpt_ending, 0.00) AS ending,
             COALESCE(flrpt_debits, 0.00) AS debits,
             COALESCE(flrpt_credits, 0.00) AS credits,
             COALESCE(flrpt_budget, 0.00) AS budget,
             COALESCE(flrpt_diff, 0.00) AS diff,
             COALESCE(flrpt_custom, 0.00) AS custom INTO _g
        FROM flrpt
       WHERE ((flrpt_flhead_id=pFlheadid)
         AND  (flrpt_period_id=pPeriodid)
          AND (flrpt_interval=pInterval)
--       AND  (flrpt_username=_username)
         AND  (flrpt_type=_r.type)
         AND  (flrpt_type_id=_r.type_id));
      IF (_r.subtract) THEN
        UPDATE flrpt
           SET flrpt_beginning = flrpt_beginning - _g.beginning,
               flrpt_ending    = flrpt_ending    - _g.ending,
               flrpt_debits    = flrpt_debits    - _g.debits,
               flrpt_credits   = flrpt_credits   - _g.credits,
               flrpt_budget    = flrpt_budget    - _g.budget,
               flrpt_diff      = flrpt_diff      - _g.diff,
               flrpt_custom    = flrpt_custom    - _g.custom
         WHERE ((flrpt_flhead_id=pFlheadid)
           AND  (flrpt_period_id=pPeriodid)
           AND  (flrpt_interval=pInterval)
--         AND  (flrpt_username=_username)
           AND  (flrpt_type='G')
           AND  (flrpt_type_id=pFlgrpid));
      ELSE
        UPDATE flrpt
           SET flrpt_beginning = flrpt_beginning + _g.beginning,
               flrpt_ending    = flrpt_ending    + _g.ending,
               flrpt_debits    = flrpt_debits    + _g.debits,
               flrpt_credits   = flrpt_credits   + _g.credits,
               flrpt_budget    = flrpt_budget    + _g.budget,
               flrpt_diff      = flrpt_diff      + _g.diff,
               flrpt_custom    = flrpt_custom    + _g.custom
         WHERE ((flrpt_flhead_id=pFlheadid)
           AND  (flrpt_period_id=pPeriodid)
           AND  (flrpt_interval=pInterval)
--         AND  (flrpt_username=_username)
           AND  (flrpt_type='G')
           AND  (flrpt_type_id=pFlgrpid));
      END IF;

-- If we are summarizing then we need to remove the record we created now that we have updated the total
      IF (pSummarize) THEN
        DELETE FROM flrpt
         WHERE ((flrpt_flhead_id=pFlheadid)
          AND  (flrpt_period_id=pPeriodid)
          AND  (flrpt_interval=pInterval)
--        AND  (flrpt_username=_username)
          AND  (flrpt_type=_r.type)
          AND  (flrpt_type_id=_r.type_id));
      END IF;

    ELSE
      IF (_r.type = 'I' OR _r.type = 'S' ) THEN

-- If we are not summarizing then create a new entry for this record
        IF (NOT pSummarize) THEN
          INSERT INTO flrpt
                 (flrpt_flhead_id, flrpt_period_id, flrpt_username,
                  flrpt_order,
                  flrpt_level, flrpt_type, flrpt_type_id,
                  flrpt_beginning, flrpt_ending,
                  flrpt_debits, flrpt_credits, flrpt_budget, flrpt_diff, flrpt_custom,
                  flrpt_beginningprcnt, flrpt_endingprcnt,
                  flrpt_debitsprcnt, flrpt_creditsprcnt, flrpt_budgetprcnt, flrpt_diffprcnt, flrpt_customprcnt,
                  flrpt_parent_id,flrpt_accnt_id,flrpt_interval)
          VALUES (pFlheadid, pPeriodid, _username,
                  (COALESCE(( SELECT MAX(flrpt_order)
                               FROM flrpt
                              WHERE ((flrpt_flhead_id=pFlheadid)
                                AND  (flrpt_period_id=pPeriodid)
                                AND  (flrpt_interval=pInterval)
--                              AND  (flrpt_username=_username)
                                )
                            ), 1) + 1),
                  pLevel, _r.type, _r.type_id,
                  _r.beginning, _r.ending,
                  _r.debits, _r.credits, _r.budget, _r.diff, _r.custom,
                  _r.beginningprcnt, _r.endingprcnt,
                  _r.debitsprcnt, _r.creditsprcnt, _r.budgetprcnt, _r.diffprcnt, _r.customprcnt,
                  pFlgrpid,_r.accnt_id,pInterval);
        END IF;

-- Update the parent item
        IF (_r.subtract) THEN
          UPDATE flrpt
             SET flrpt_beginning = flrpt_beginning - COALESCE(_r.beginning, 0.00),
                 flrpt_ending    = flrpt_ending    - COALESCE(_r.ending, 0.00),
                 flrpt_debits    = flrpt_debits    - COALESCE(_r.debits, 0.00),
                 flrpt_credits   = flrpt_credits   - COALESCE(_r.credits, 0.00),
                 flrpt_budget    = flrpt_budget    - COALESCE(_r.budget, 0.00),
                 flrpt_diff      = flrpt_diff      - COALESCE(_r.diff, 0.00),
                 flrpt_custom    = flrpt_custom    - COALESCE(_r.custom, 0.00)
           WHERE ((flrpt_flhead_id=pFlheadid)
             AND  (flrpt_period_id=pPeriodid)
             AND  (flrpt_interval=pInterval)
--           AND  (flrpt_username=_username)
             AND  (flrpt_type='G')
             AND  (flrpt_type_id=pFlgrpid));
        ELSE
          UPDATE flrpt
             SET flrpt_beginning = flrpt_beginning + COALESCE(_r.beginning, 0.00),
                 flrpt_ending    = flrpt_ending    + COALESCE(_r.ending, 0.00),
                 flrpt_debits    = flrpt_debits    + COALESCE(_r.debits, 0.00),
                 flrpt_credits   = flrpt_credits   + COALESCE(_r.credits, 0.00),
                 flrpt_budget    = flrpt_budget    + COALESCE(_r.budget, 0.00),
                 flrpt_diff      = flrpt_diff      + COALESCE(_r.diff, 0.00),
                 flrpt_custom    = flrpt_custom    + COALESCE(_r.custom, 0.00)
           WHERE ((flrpt_flhead_id=pFlheadid)
             AND  (flrpt_interval=pInterval)
             AND  (flrpt_period_id=pPeriodid)
--           AND  (flrpt_username=_username)
             AND  (flrpt_type='G')
             AND  (flrpt_type_id=pFlgrpid));
        END IF;

      END IF;
    END IF;

  END LOOP;

  IF (NOT pSummarize) THEN
-- If this group wants a summarized line create it here.
    IF (_subtotal) THEN
      INSERT INTO flrpt
             (flrpt_flhead_id, flrpt_period_id, flrpt_username,
              flrpt_order,
              flrpt_level, flrpt_type, flrpt_type_id,
              flrpt_beginning, flrpt_ending,
              flrpt_debits, flrpt_credits, flrpt_budget, flrpt_diff, flrpt_custom,
              flrpt_beginningprcnt, flrpt_endingprcnt,
              flrpt_debitsprcnt, flrpt_creditsprcnt, flrpt_budgetprcnt, flrpt_diffprcnt, flrpt_customprcnt,
              flrpt_parent_id, flrpt_altname,flrpt_interval )
      SELECT pFlheadid, pPeriodid, _username,
             (COALESCE(( SELECT MAX(flrpt_order)
                           FROM flrpt
                          WHERE ((flrpt_flhead_id=pFlheadid)
                            AND  (flrpt_period_id=pPeriodid)
                            AND  (flrpt_interval=pInterval)
--                          AND  (flrpt_username=_username)
                                )
                       ), 1) + 1),
             pLevel, 'T', -1,
             CASE WHEN (flgrp_showstart) THEN flrpt_beginning
                  ELSE NULL
             END,
             CASE WHEN (flgrp_showend) THEN flrpt_ending
                  ELSE NULL
             END,
             CASE WHEN (flgrp_showdelta) THEN flrpt_debits
                  ELSE NULL
             END,
             CASE WHEN (flgrp_showdelta) THEN flrpt_credits
                  ELSE NULL
             END,
             CASE WHEN (flgrp_showbudget) THEN flrpt_budget
                  ELSE NULL
             END,
             CASE WHEN (flgrp_showdiff) THEN flrpt_diff
                  ELSE NULL
             END,
             CASE WHEN (flgrp_showcustom) THEN flrpt_custom
                  ELSE NULL
             END,
             CASE WHEN (flgrp_showstartprcnt) THEN flrpt_beginningprcnt
                  ELSE NULL
             END,
             CASE WHEN (flgrp_showendprcnt) THEN flrpt_endingprcnt
                  ELSE NULL
             END,
             CASE WHEN (flgrp_showdeltaprcnt) THEN flrpt_debitsprcnt
                  ELSE NULL
             END,
             CASE WHEN (flgrp_showdeltaprcnt) THEN flrpt_creditsprcnt
                  ELSE NULL
             END,
             CASE WHEN (flgrp_showbudgetprcnt) THEN flrpt_budgetprcnt
                  ELSE NULL
             END,
             CASE WHEN (flgrp_showdiffprcnt) THEN flrpt_diffprcnt
                  ELSE NULL
             END,
             CASE WHEN (flgrp_showcustomprcnt) THEN flrpt_customprcnt
                  ELSE NULL
             END,
             pFlgrpid,
             CASE WHEN (flgrp_usealtsubtotal) THEN flgrp_altsubtotal
                  ELSE NULL
             END, pInterval
        FROM flrpt, flgrp
       WHERE ((flrpt_flhead_id=flgrp_flhead_id)
         AND  (flrpt_type_id=flgrp_id)
         AND  (flrpt_flhead_id=pFlheadid)
         AND  (flrpt_period_id=pPeriodid)
         AND  (flrpt_interval=pInterval)
--       AND  (flrpt_username=_username)
         AND  (flrpt_type='G')
         AND  (flrpt_type_id=pFlgrpid));
    END IF;
  END IF;

  return TRUE;
END;
$$ LANGUAGE 'plpgsql';
