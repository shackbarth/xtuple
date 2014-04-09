
CREATE OR REPLACE FUNCTION deleteCharacteristic(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCharid ALIAS FOR $1;
  _check INTEGER;
  _r RECORD;

BEGIN

--  Cache the specifics of the characteristic
  SELECT * INTO _r
  FROM char
  WHERE (char_id=pCharid);
  IF (NOT(FOUND)) THEN
    RETURN 0;
  END IF;

--  If the passed characteristic is used
  SELECT * INTO _r
  FROM charass
  WHERE (charass_char_id=pCharid)
  LIMIT 1;
  IF (FOUND) THEN
    IF (_r.charass_target_type = 'I') THEN
      RETURN -1;
    ELSIF (_r.charass_target_type = 'C') THEN
      RETURN -2;
    ELSIF (_r.charass_target_type = 'ADDR') THEN
      RETURN -3;
    ELSIF (_r.charass_target_type = 'CNTCT') THEN
      RETURN -4;
    ELSIF (_r.charass_target_type = 'CRMACCT') THEN
      RETURN -5;
    ELSIF (_r.charass_target_type = 'INCDT	') THEN
      RETURN -6;
    ELSIF (_r.charass_target_type = 'EMP') THEN
      RETURN -7;
    ELSIF (_r.charass_target_type = 'QU') THEN
      RETURN -8;
    ELSIF (_r.charass_target_type = 'SO') THEN
      RETURN -9;
    ELSIF (_r.charass_target_type = 'INV') THEN
      RETURN -10;
    ELSIF (_r.charass_target_type = 'V') THEN
      RETURN -11;
    ELSIF (_r.charass_target_type = 'PO') THEN
      RETURN -12;
    ELSIF (_r.charass_target_type = 'VO') THEN
      RETURN -13;
    ELSE
      RETURN -99;
    END IF;
  END IF;

--  Delete the passed characterisitic
  DELETE FROM char
  WHERE (char_id=pCharid);

  RETURN pCharid;

END;
$$ LANGUAGE 'plpgsql';

