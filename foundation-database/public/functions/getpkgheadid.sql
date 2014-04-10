CREATE OR REPLACE FUNCTION getPkgheadId(text) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  ppkgname ALIAS FOR $1;
  _returnVal INTEGER;
BEGIN
  IF (ppkgname IS NULL) THEN
    RETURN NULL;
  END IF;

  SELECT pkghead_id INTO _returnVal
  FROM pkghead
  WHERE (UPPER(pkghead_name)=UPPER(ppkgname));

  IF (_returnVal IS NULL) THEN
    RAISE EXCEPTION 'Package % not found.', ppkgname;
  END IF;

  RETURN _returnVal;
END;
$$ LANGUAGE 'plpgsql';
