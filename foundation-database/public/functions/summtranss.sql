CREATE OR REPLACE FUNCTION summTransS (pItemsiteid INTEGER,
                                       pStartDate DATE,
                                       pEndDate DATE) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _value NUMERIC;

BEGIN

  SELECT SUM( CASE WHEN (invhist_transtype = 'RS') THEN (invhist_invqty * -1)
                   ELSE (invhist_invqty)
              END ) INTO _value
  FROM invhist
  WHERE ( (invhist_transdate::DATE BETWEEN pStartDate AND pEndDate)
   AND (invhist_transtype IN ('SC', 'SH', 'SV', 'RS'))
   AND (invhist_ordtype != 'TO')
   AND (invhist_itemsite_id=pItemsiteid) );

  IF (_value IS NULL) THEN
    _value := 0;
  END IF;

  RETURN _value;

END;
$$ LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION summTransS(pItemsiteid INTEGER,
                                      pCalitemid INTEGER) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemsiteid ALIAS FOR $1;
  pCalitemid ALIAS FOR $2;
  _value NUMERIC;

BEGIN

  SELECT summTransS(pItemsiteid, findPeriodStart(pCalitemid), findPeriodEnd(pCalitemid)) INTO _value;

  RETURN _value;

END;
$$ LANGUAGE 'plpgsql';
