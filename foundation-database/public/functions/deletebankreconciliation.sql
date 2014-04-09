
CREATE OR REPLACE FUNCTION deleteBankReconciliation(INTEGER) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pbankrecid    ALIAS FOR $1;
BEGIN
  DELETE FROM bankrecitem
  WHERE bankrecitem_bankrec_id=pbankrecid;

  DELETE FROM bankrec
  WHERE bankrec_id=pbankrecid;

  RETURN 0;
END;
' LANGUAGE 'plpgsql';

