CREATE OR REPLACE FUNCTION getUsrId(pUsr text) RETURNS INTEGER STABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _returnVal INTEGER;
BEGIN
  SELECT usr_id INTO _returnVal
  FROM usr
  WHERE (usr_username=COALESCE(pUsr, getEffectiveXtUser()));

  IF (_returnVal IS NULL) THEN
	RAISE EXCEPTION 'User % not found.', pUsr;
  END IF;

  RETURN _returnVal;
END;
$$ LANGUAGE 'plpgsql';
