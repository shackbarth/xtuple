
CREATE OR REPLACE FUNCTION getPacklistItemLotSerial(INTEGER, INTEGER) RETURNS TEXT AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pShipheadId ALIAS FOR $1;
  pOrderItemId ALIAS FOR $2;
  _lotserial text;
  _r RECORD;
  _first BOOLEAN;
  
BEGIN
 
  --Test to see if Lot/Serial Enabled
  SELECT metric_value INTO _lotserial
  FROM metric
  WHERE ((metric_name=''LotSerialControl'')
  AND (metric_value =''t''));

  IF (FOUND) THEN
    _lotserial := '''';
    _first := true;

    FOR _r IN SELECT DISTINCT ls_number
              FROM invdetail, invhist, shipitem, ls
             WHERE ((shipitem_shiphead_id=pShipheadId)
               AND  (shipitem_orderitem_id=pOrderItemId)
               AND  (shipitem_invhist_id=invhist_id)
               AND  (invhist_id=invdetail_invhist_id)
               AND  (invdetail_ls_id=ls_id)) LOOP
      IF (_first = false) THEN
        _lotserial := _lotserial || '', '';
      END IF;
      _lotserial := _lotserial || _r.ls_number;
      _first := false;
    END LOOP;

    RETURN _lotserial;
  ELSE
    RETURN '''';
  END IF;
  
END
' LANGUAGE 'plpgsql';
