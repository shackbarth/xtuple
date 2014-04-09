CREATE OR REPLACE FUNCTION deletePackage(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  ppkgheadid    ALIAS FOR $1;
  _i            INTEGER := 0;
  _pkgname      TEXT;
  _r            RECORD;
  _tabs         TEXT[] := ARRAY['cmd',  'cmdarg', 'image',  'metasql',
                                'priv', 'report', 'script', 'uiform'];
  _debug        BOOL := false;

BEGIN
  IF (EXISTS(SELECT *
             FROM pkgdep
             WHERE (pkgdep_parent_pkghead_id=ppkgheadid))) THEN
    RETURN -1;
  END IF;

  SELECT pkghead_name INTO _pkgname
  FROM pkghead
  WHERE (pkghead_id=ppkgheadid);
  IF (NOT FOUND) THEN
    RETURN -2;
  END IF;

  IF (LOWER(_pkgname) = 'public' OR LOWER(_pkgname) = 'api') THEN
    RETURN -3;
  END IF;

  FOR _i IN ARRAY_LOWER(_tabs,1)..ARRAY_UPPER(_tabs,1) LOOP
    EXECUTE 'ALTER TABLE ' || _pkgname || '.pkg' || _tabs[_i] ||
            ' DISABLE TRIGGER pkg' || _tabs[_i] || 'altertrigger;';
  END LOOP;

  DELETE FROM pkghead WHERE pkghead_id=ppkgheadid;

  RETURN ppkgheadid;
END;
$$ LANGUAGE 'plpgsql';
