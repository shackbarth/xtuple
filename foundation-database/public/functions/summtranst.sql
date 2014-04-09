CREATE OR REPLACE FUNCTION summTransT (INTEGER, DATE, DATE) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemsiteid ALIAS FOR $1;
  pStartDate ALIAS FOR $2;
  pEndDate ALIAS FOR $3;
  _value NUMERIC;

BEGIN

  SELECT SUM( CASE WHEN (invhist_transtype = 'TS') THEN (invhist_invqty * -1)
                   ELSE (invhist_invqty)
              END ) INTO _value
  FROM invhist
  WHERE ( (invhist_transdate::DATE BETWEEN pStartDate AND pEndDate)
   AND (invhist_transtype IN ('TS', 'TR', 'TW'))
   AND (invhist_itemsite_id=pItemsiteid) );

  IF (_value IS NULL) THEN
    _value := 0;
  END IF;

  RETURN _value;

END;
$$ LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION summTransT(INTEGER, INTEGER) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemsiteid ALIAS FOR $1;
  pCalitemid ALIAS FOR $2;
  _value NUMERIC;

BEGIN

  SELECT summTransT(pItemsiteid, findPeriodStart(pCalitemid), findPeriodEnd(pCalitemid)) INTO _value;

  RETURN _value;

END;
$$ LANGUAGE 'plpgsql';
