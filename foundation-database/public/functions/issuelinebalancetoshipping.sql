CREATE OR REPLACE FUNCTION issueLineBalanceToShipping(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  RETURN issueLineBalanceToShipping('SO', $1, NULL);
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION issueLineBalanceToShipping(TEXT, INTEGER, TIMESTAMP WITH TIME ZONE) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  RETURN issueLineBalanceToShipping($1, $2, $3, 0, NULL);
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION issueLineBalanceToShipping(TEXT, INTEGER, TIMESTAMP WITH TIME ZONE, INTEGER, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pordertype		ALIAS FOR $1;
  pitemid		ALIAS FOR $2;
  ptimestamp		ALIAS FOR $3;
  pitemlocseries       	ALIAS FOR $4;
  pinvhistid		ALIAS FOR $5;
  _itemlocSeries	INTEGER := 0;
  _qty			NUMERIC;

BEGIN
  _itemlocSeries := COALESCE(pitemlocseries,0);
  
  IF (pordertype = 'SO') THEN
    SELECT CASE WHEN (fetchMetricBool('RequireSOReservations'))
                THEN coitem_qtyreserved
                ELSE noNeg( coitem_qtyord - coitem_qtyshipped + coitem_qtyreturned - qtyAtShipping('SO', coitem_id) )
           END INTO _qty
    FROM coitem
    WHERE (coitem_id=pitemid);
  ELSEIF (pordertype = 'TO') THEN
    SELECT noNeg( toitem_qty_ordered - toitem_qty_shipped - qtyAtShipping('TO', toitem_id) )
               INTO _qty
    FROM toitem
    WHERE (toitem_id=pitemid);
  ELSE
    RETURN -1;
  END IF;

  IF (_qty > 0) THEN
    _itemlocSeries := issueToShipping(pordertype, pitemid, _qty, _itemlocSeries, ptimestamp, pinvhistid);
  END IF;

  RETURN _itemlocSeries;

END;
$$ LANGUAGE 'plpgsql';
