CREATE OR REPLACE FUNCTION getPacklistCharName(INTEGER, INTEGER) RETURNS TEXT AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pShipheadId ALIAS FOR $1;
  pOrderItemId ALIAS FOR $2;
  _charname text;
  _r RECORD;
  _first BOOLEAN;
  
BEGIN

-- If transfer order, get out
  SELECT shiphead_order_type INTO _r
  FROM shiphead
  WHERE ((shiphead_id=pShipheadId)
  AND (shiphead_order_type=''TO''));
  
  IF (FOUND) THEN
    RETURN '''';
  END IF;

  _charname := '''';
  _first := true;

  FOR _r IN SELECT char_name
            FROM char, charass
            WHERE ((char_id=charass_char_id)
            AND (charass_target_type=''SI'')
            AND (charass_target_id=pOrderItemId)) 
  LOOP
        IF (_first = false) THEN
          _charname := _charname || ''
'';
        END IF;
        _charname := _charname || _r.char_name;
        _first := false;
  END LOOP;

  RETURN _charname;
  
END
' LANGUAGE 'plpgsql';
