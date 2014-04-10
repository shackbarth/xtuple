CREATE OR REPLACE FUNCTION calcTotalSlipQty(INTEGER) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pTagid ALIAS FOR $1;
  _qty NUMERIC := 0;

BEGIN

  SELECT SUM(COALESCE(cntslip_qty, 0.0)) INTO _qty
  FROM cntslip
  WHERE (cntslip_cnttag_id=pTagid);

  RETURN _qty;

END;
$$ LANGUAGE 'plpgsql';
