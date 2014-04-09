
CREATE OR REPLACE FUNCTION itemCharValue(INTEGER, TEXT) RETURNS TEXT AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemid ALIAS FOR $1;
  pCharName ALIAS FOR $2;
  _value TEXT;

BEGIN

  SELECT charass_value INTO _value
  FROM charass, char
  WHERE ( (charass_char_id=char_id)
   AND (charass_target_type=''I'')
   AND (charass_target_id=pItemid)
   AND (char_name=pCharName) );
  IF (NOT FOUND) THEN
    _value = '''';
  END IF;

  RETURN _value;

END;
' LANGUAGE 'plpgsql';

