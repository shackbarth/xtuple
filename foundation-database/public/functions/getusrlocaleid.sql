CREATE OR REPLACE FUNCTION getUsrLocaleId() RETURNS INTEGER IMMUTABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _returnVal INTEGER;
BEGIN
  SELECT CAST(usrpref_value AS INTEGER)
  FROM usrpref
  WHERE (usrpref_username=getEffectiveXTUser())
    AND (usrpref_name='locale_id') INTO _returnVal;

  IF (_returnVal IS NULL) THEN
    SELECT locale_id
    FROM locale
    WHERE (LOWER(locale_code) = 'default')
    LIMIT 1 INTO _returnVal;
  END IF;

  IF (_returnVal IS NULL) THEN
    SELECT locale_id
    FROM locale
    ORDER BY locale_id
    LIMIT 1 INTO _returnVal;
  END IF;

  IF (_returnVal IS NULL) THEN
	RAISE EXCEPTION 'User Locale not found.';
  END IF;

  RETURN _returnVal;
END;
$$ LANGUAGE 'plpgsql';
