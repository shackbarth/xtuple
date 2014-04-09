CREATE OR REPLACE FUNCTION disablePackage(TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  ppkgname ALIAS FOR $1;
  _i       INTEGER := 0;
  _tabs    TEXT[] := ARRAY['cmd',  'cmdarg', 'image',  'metasql',
                           'priv', 'report', 'script', 'uiform'];

BEGIN
  IF (version() < 'PostgreSQL 8.2') THEN
    RETURN -1;
  END IF;

  FOR _i IN ARRAY_LOWER(_tabs,1)..ARRAY_UPPER(_tabs,1) LOOP
    EXECUTE 'ALTER TABLE ' || ppkgname || '.pkg' || _tabs[_i] ||
            ' NO INHERIT public.' || _tabs[_i] || ';';
  END LOOP;
  
  RETURN 0;
END;
$$
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION disablePackage(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  ppkgheadid    ALIAS FOR $1;
  _pkgname      TEXT;

BEGIN
  SELECT pkghead_name INTO _pkgname
  FROM pkghead
  WHERE (pkghead_id=ppkgheadid);
  IF (NOT FOUND) THEN
    RETURN -2;
  END IF;

  RETURN disablePackage(_pkgname);
END;
$$
LANGUAGE 'plpgsql';
