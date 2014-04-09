CREATE OR REPLACE FUNCTION calcpendingarapplications(INTEGER) RETURNS NUMERIC STABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  paropenid     ALIAS FOR $1;
  _arcreditsum  NUMERIC;
  _aropencurrid INTEGER;
  _cashrcptsum  NUMERIC;
  _sense INTEGER;

BEGIN
  SELECT aropen_curr_id,
    (CASE WHEN aropen_doctype IN ('I','D') THEN 1 ELSE -1 END) 
    INTO _aropencurrid, _sense
  FROM aropen
  WHERE (aropen_id=paropenid);

  SELECT SUM(currToCurr(cashrcpt_curr_id, _aropencurrid,
                        cashrcptitem_amount + cashrcptitem_discount, coalesce(cashrcpt_applydate, cashrcpt_distdate))) * _sense INTO _cashrcptsum
  FROM cashrcptitem, cashrcpt
  WHERE ((cashrcptitem_cashrcpt_id=cashrcpt_id)
    AND  (NOT cashrcpt_posted)
    AND  (NOT cashrcpt_void)
    AND  (cashrcptitem_aropen_id=paropenid)
    );

  SELECT SUM(currToCurr(arcreditapply_curr_id, _aropencurrid,
                        arcreditapply_amount, CURRENT_DATE)) INTO _arcreditsum
  FROM arcreditapply
  WHERE ((arcreditapply_target_aropen_id=paropenid)
    );

  RETURN round(COALESCE(_cashrcptsum, 0) + COALESCE(_arcreditsum, 0),2);
END;
$$ LANGUAGE 'plpgsql';
