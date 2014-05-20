CREATE OR REPLACE FUNCTION fixACL() RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _r        RECORD;
  _count    INTEGER := 0;
  _oldgrp   BOOLEAN := false;
  _objtype  TEXT;
  _table    TEXT;
  _schema   TEXT;

BEGIN
  IF EXISTS(SELECT 1 FROM pg_group WHERE groname = 'openmfg') THEN
    _oldgrp := true;
  END IF;
  
  FOR _r IN SELECT relname, nspname, relkind,
                   CASE relkind WHEN 'r' THEN 1
                                WHEN 'v' THEN 2
                                WHEN 'S' THEN 3
                                ELSE 4
                   END AS seq
            FROM pg_catalog.pg_class c, pg_namespace n
            WHERE ((n.oid=c.relnamespace)
              AND  (nspname in ('public', 'api') OR
                    nspname in (SELECT pkghead_name FROM pkghead))
              AND  (relkind in ('S', 'r', 'v')))
            ORDER BY seq
  LOOP
    _schema := quote_ident(_r.nspname);
    _table  := quote_ident(_r.relname);

    RAISE DEBUG '%.%', _schema, _table;
    
    IF (_oldgrp) THEN
      EXECUTE 'REVOKE ALL ON ' || _schema || '.' || _table || ' FROM openmfg;';
    END IF;
    EXECUTE 'REVOKE ALL ON ' || _schema || '.' || _table || ' FROM PUBLIC;';
    EXECUTE 'GRANT ALL ON '  || _schema || '.' || _table || ' TO GROUP xtrole;';
    _count := _count + 1;

    _objtype := CASE _r.relkind WHEN 'S' THEN 'SEQUENCE'
                                WHEN 'r' THEN 'TABLE'
                                WHEN 'v' THEN 'VIEW'
                                ELSE NULL
                END;
    IF (_objtype IS NOT NULL) THEN
      BEGIN
        EXECUTE 'ALTER ' || _objtype || ' ' ||
                _schema || '.' || _table || ' OWNER TO admin;';
      EXCEPTION WHEN OTHERS THEN
        RAISE WARNING 'Could not change ownership of %.% to admin',
                      _schema, _table;
      END;
    END IF;

  END LOOP;

  RETURN _count;
END;
$$ LANGUAGE 'plpgsql';

