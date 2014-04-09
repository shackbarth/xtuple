CREATE OR REPLACE FUNCTION sufficientInventoryToShipOrder(TEXT, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pordertype	ALIAS FOR $1;
  porderid	ALIAS FOR $2;
  _s		RECORD;
  _returnVal	INTEGER := 0;

BEGIN
  IF (pordertype = 'SO') THEN
    FOR _s IN SELECT coitem_id
	        FROM coitem
	         JOIN itemsite ON (coitem_itemsite_id=itemsite_id)
	       WHERE((coitem_cohead_id=porderid) 
	        AND (itemsite_costmethod != 'J')) LOOP
      _returnVal := sufficientInventoryToShipItem(pordertype, _s.coitem_id);
      EXIT WHEN (_returnVal < 0);
    END LOOP;
  ELSEIF (pordertype = 'TO') THEN
    FOR _s IN SELECT toitem_id
	        FROM toitem
	       WHERE(toitem_tohead_id=porderid) LOOP
      _returnVal := sufficientInventoryToShipItem(pordertype, _s.toitem_id);
      EXIT WHEN (_returnVal < 0);
    END LOOP;
  END IF;

  RETURN _returnVal;
END;
$$ LANGUAGE 'plpgsql';
