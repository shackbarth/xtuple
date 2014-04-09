
CREATE OR REPLACE FUNCTION copyBudget(INTEGER, TEXT, TEXT, INTEGER) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pBudgheadid ALIAS FOR $1;
  pName ALIAS FOR $2;
  pDescrip ALIAS FOR $3;
  pInterval ALIAS FOR $4;
  _budgheadid INTEGER;
  _periodid INTEGER;
  _result INTEGER;

BEGIN
  SELECT 1 INTO _result
    FROM budgitem
   WHERE ((budgitem_budghead_id=pBudgheadid)
     AND  (nextPeriodByInterval(budgitem_period_id, pInterval)=-1))
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -1;
  END IF;

  SELECT nextval(''budghead_budghead_id_seq'') INTO _budgheadid;
  INSERT INTO budghead
        (budghead_id, budghead_name, budghead_descrip)
  VALUES(_budgheadid, pName, pDescrip);

  INSERT INTO budgitem (budgitem_budghead_id, budgitem_period_id,
                        budgitem_accnt_id, budgitem_amount)
  SELECT _budgheadid, nextPeriodByInterval(budgitem_period_id, pInterval),
         budgitem_accnt_id, budgitem_amount
    FROM budgitem
   WHERE (budgitem_budghead_id=pBudgheadid);

  RETURN _budgheadid;
END;
' LANGUAGE 'plpgsql';

