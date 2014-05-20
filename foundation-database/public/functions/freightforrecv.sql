-- if $3 == true then calculate freight on posted records
-- if $3 == false then calculate freight on unposted records
CREATE OR REPLACE FUNCTION freightForRecv(TEXT, INTEGER, BOOLEAN) RETURNS NUMERIC AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pordertype	ALIAS FOR $1;
  porderitemid	ALIAS FOR $2;
  pposted	ALIAS FOR $3;
  _freight	NUMERIC;

BEGIN
  IF (pordertype = ''TO'' AND NOT fetchMetricBool(''MultiWhs'')) THEN
    RETURN 0;
  ELSIF (pordertype = ''RA'' AND NOT fetchMetricBool(''EnableReturnAuth'')) THEN
    RETURN 0;
  END IF;

  SELECT SUM(COALESCE(recv_freight, 0)) INTO _freight
  FROM recv
  WHERE ((recv_orderitem_id=porderitemid)
    AND  (recv_posted = pposted)
    AND  (recv_order_type=pordertype));

  RETURN COALESCE(_freight, 0.0);

END;
' LANGUAGE 'plpgsql';
