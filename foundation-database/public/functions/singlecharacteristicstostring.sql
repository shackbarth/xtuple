CREATE OR REPLACE FUNCTION singleCharacteristicsToString(TEXT, INTEGER, TEXT, TEXT, INTEGER) RETURNS text AS
$$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pTargetType ALIAS FOR $1;
  pTargetId ALIAS FOR $2;
  pValKeySep ALIAS FOR $3;
  pPairSep ALIAS FOR $4;
  pCharId ALIAS FOR $5;
  _string TEXT := '';
  _extra BOOLEAN := false;
  _r RECORD;
BEGIN
  FOR _r IN SELECT char_name, charass_value
              FROM charass, char
             WHERE ((charass_char_id=char_id)
               AND  (charass_char_id=pCharId)
               AND  (charass_target_type=pTargetType)
               AND  (charass_target_id=pTargetId)) LOOP
    IF(_extra) THEN
      _string := _string || pPairSep;
    END IF;
    _extra := true;

    _string := _string || _r.char_name || pValKeySep || _r.charass_value;
  END LOOP;

  RETURN _string;
END;
$$ LANGUAGE 'plpgsql';
