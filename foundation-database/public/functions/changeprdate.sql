DROP FUNCTION IF EXISTS changeprdate(integer, date);
CREATE OR REPLACE FUNCTION changePrDate(INTEGER, DATE) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pPrid ALIAS FOR $1;
  pDueDate ALIAS FOR $2;

BEGIN

  UPDATE pr
  SET pr_duedate=pDueDate
  WHERE (pr_id=pPrid);

  RETURN 0;

END;
$$ LANGUAGE 'plpgsql';
