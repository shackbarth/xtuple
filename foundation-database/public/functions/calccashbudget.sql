CREATE OR REPLACE FUNCTION calccashbudget(integer, integer, character) RETURNS numeric AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pAccntId ALIAS FOR $1;
  pPeriodId ALIAS FOR $2;
  pInterval ALIAS FOR $3;
  _accntType CHAR;
  _currentBudget NUMERIC;
  _priorBudget NUMERIC;
  _result NUMERIC;
BEGIN

        SELECT accnt_type INTO _accntType
        FROM accnt
        WHERE (accnt_id=pAccntId);

        SELECT COALESCE(SUM(budget_amount),0) INTO _currentBudget
        FROM budget
        WHERE ((budget_accnt_id=pAccntId)
        AND (budget_period_id=pPeriodId));

        IF (pInterval='M') THEN
        SELECT (COALESCE(SUM(budget_amount),0)) INTO _priorBudget
                FROM budget,
                (SELECT COALESCE(pp.period_id,-1) AS prior_period_id
                        FROM period cp, period pp
                        WHERE ((cp.period_id=pPeriodId)
                        AND (cp.period_start > pp.period_start))
                        ORDER BY pp.period_start DESC LIMIT 1) AS data
                WHERE ((budget_accnt_id=pAccntId)
                AND (budget_period_id=prior_period_id));

                ELSE IF (pInterval='Q') THEN
                        SELECT (COALESCE(SUM(budget_amount),0)) INTO _priorBudget
                        FROM budget,
                                (SELECT COALESCE(pp.period_id,-1) AS prior_period_id
                                FROM period cp, period pp
                                WHERE ((cp.period_id=pPeriodId)
                                AND (cp.period_start > pp.period_start)
                                AND (pp.period_quarter=
                                CASE WHEN cp.period_quarter > 1 THEN
                                        cp.period_quarter - 1
                                ELSE 4 END)
                                AND (pp.period_start >= cp.period_start - interval '1 year'))
                                ORDER BY pp.period_start DESC LIMIT 1) AS data
                        WHERE ((budget_accnt_id=pAccntId)
                        AND (budget_period_id=prior_period_id));


                ELSE
                        SELECT (COALESCE(SUM(budget_amount),0)) INTO _priorBudget
                        FROM budget,
                                (SELECT pp.period_id AS prior_period_id
                        FROM period cp, period pp, yearperiod cy, yearperiod py
                        WHERE ((cp.period_id=pPeriodId)
                        AND (cp.period_yearperiod_id=cy.yearperiod_id)
                        AND (pp.period_yearperiod_id=py.yearperiod_id)
                        AND (cy.yearperiod_start > py.yearperiod_start))
                        ORDER BY pp.period_start DESC LIMIT 1) AS data
                        WHERE ((budget_accnt_id=pAccntId)
                        AND (budget_period_id=prior_period_id));

                END IF;
        END IF;

        IF _accntType='A' THEN
                _result := ((_priorBudget-_currentBudget) * -1 );

        ELSE IF (_accntType IN ('L','Q')) THEN
                _result := ((_priorBudget-_currentBudget) *-1);

        ELSE RETURN -1;
        END IF;
  END IF;


  RETURN _result;


END;
$$ LANGUAGE 'plpgsql';
