CREATE OR REPLACE FUNCTION summTransR (INTEGER, DATE, DATE) RETURNS NUMERIC AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemsiteid ALIAS FOR $1;
  pStartDate ALIAS FOR $2;
  pEndDate ALIAS FOR $3;
  _value NUMERIC;

BEGIN

  SELECT SUM(invhist_invqty) INTO _value
  FROM invhist
  WHERE ((invhist_transdate::DATE BETWEEN pStartDate AND pEndDate)
   AND (invhist_transtype IN (''RM'', ''RP'', ''RX''))
   AND (invhist_itemsite_id=pItemsiteid) );

  IF (_value IS NULL) THEN
    _value := 0;
  END IF;

  RETURN _value;

END;
' LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION summTransR(INTEGER, INTEGER) RETURNS NUMERIC AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemsiteid ALIAS FOR $1;
  pCalitemid ALIAS FOR $2;
  _value NUMERIC;

BEGIN

  SELECT summTransR(pItemsiteid, findPeriodStart(pCalitemid), findPeriodEnd(pCalitemid)) INTO _value;

  RETURN _value;

END;
' LANGUAGE 'plpgsql';
