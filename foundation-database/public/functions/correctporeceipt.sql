CREATE OR REPLACE FUNCTION correctPoReceipt(INTEGER, NUMERIC, NUMERIC, INTEGER) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pPorecvid ALIAS FOR $1;
  pQty ALIAS FOR $2;
  pFreight ALIAS FOR $3;
  pItemlocSeries ALIAS FOR $4;

BEGIN
  RETURN correctReceipt(''PO'', $1, $2, $3, $4, NULL, NULL);
END;
' LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION correctPoReceipt(INTEGER, NUMERIC, NUMERIC, INTEGER, INTEGER, DATE) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  RETURN correctReceipt(''PO'', $1, $2, $3, $4, $5, $6);
END;
' LANGUAGE 'plpgsql';
