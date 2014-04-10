CREATE OR REPLACE FUNCTION calcPurchaseOrderDueDate(pPoheadid INTEGER) RETURNS DATE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _result DATE;
BEGIN

  SELECT MIN(poitem_duedate) INTO _result
  FROM poitem
  WHERE (poitem_pohead_id=pPoheadid);

  RETURN _result;

END;
$$ LANGUAGE 'plpgsql';
