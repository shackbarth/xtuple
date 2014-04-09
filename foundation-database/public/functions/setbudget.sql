
CREATE OR REPLACE FUNCTION setBudget(INTEGER, INTEGER, NUMERIC) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pPeriodid ALIAS FOR $1;
  pAccntid ALIAS FOR $2;
  pAmount ALIAS FOR $3;

BEGIN
  RETURN setBudget(1, pPeriodid, pAccntid, pAmount);
END;
' LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION setBudget(INTEGER, INTEGER, INTEGER, NUMERIC) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pBudgheadid ALIAS FOR $1;
  pPeriodid ALIAS FOR $2;
  pAccntid ALIAS FOR $3;
  pAmount ALIAS FOR $4;
  _budgetid INTEGER;

BEGIN

  SELECT budgitem_id INTO _budgetid
    FROM budgitem
   WHERE ((budgitem_period_id=pPeriodid)
     AND  (budgitem_budghead_id=pBudgheadid)
     AND  (budgitem_accnt_id=pAccntid));
  IF (FOUND) THEN
    UPDATE budgitem
       SET budgitem_amount = pAmount
     WHERE (budgitem_id=_budgetid);
  ELSE
    SELECT nextval(''budgitem_budgitem_id_seq'') INTO _budgetid;

    INSERT INTO budgitem
          (budgitem_id, budgitem_budghead_id, budgitem_period_id, budgitem_accnt_id, budgitem_amount)
    VALUES(_budgetid, pBudgheadid, pPeriodid, pAccntid, pAmount);
  END IF;

  RETURN _budgetid;

END;
' LANGUAGE 'plpgsql';

