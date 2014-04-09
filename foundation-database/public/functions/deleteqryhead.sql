CREATE OR REPLACE FUNCTION deleteQryhead(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pqryheadid    ALIAS FOR $1;

BEGIN
  DELETE FROM qryitem WHERE (qryitem_qryhead_id=pqryheadid);
  DELETE FROM qryhead WHERE (qryhead_id=pqryheadid);

  RETURN pqryheadid;
END;
$$
LANGUAGE 'plpgsql';
