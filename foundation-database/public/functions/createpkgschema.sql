CREATE OR REPLACE FUNCTION createPkgSchema(TEXT, TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pname         ALIAS FOR $1;
  pcomment      ALIAS FOR $2;
  _createtable  TEXT;
  _debug        BOOL    := true;
  _namespaceoid INTEGER := -1;
  _tabs         TEXT[] := ARRAY['cmd',  'cmdarg', 'image',  'metasql',
                                'priv', 'report', 'script', 'uiform'] ;
  _pkgtab       TEXT;

BEGIN
  IF (LENGTH(COALESCE(pname, '')) <= 0) THEN
    RAISE EXCEPTION 'Cannot create a schema for this package without a name.';
  END IF;

  SELECT oid INTO _namespaceoid
  FROM pg_namespace
  WHERE (LOWER(nspname)=LOWER(pname));
  IF (NOT FOUND) THEN
    EXECUTE 'CREATE SCHEMA ' || LOWER(pname);
    EXECUTE 'GRANT ALL ON SCHEMA ' || LOWER(pname) || ' TO GROUP xtrole;';

    SELECT oid INTO _namespaceoid
    FROM pg_namespace
    WHERE (LOWER(nspname)=LOWER(pname));
  END IF;

  FOR i IN ARRAY_LOWER(_tabs,1)..ARRAY_UPPER(_tabs,1) LOOP
    _pkgtab := pname || '.pkg' || _tabs[i];

    IF NOT EXISTS(SELECT oid
                  FROM pg_class
                  WHERE ((relname=_pkgtab)
                     AND (relnamespace=_namespaceoid))) THEN
      _createtable := 'CREATE TABLE ' || _pkgtab || ' () INHERITS (' || _tabs[i] || ');';
      IF (_debug) THEN RAISE NOTICE '%', _createtable; END IF;
      EXECUTE _createtable;

      EXECUTE 'ALTER TABLE ' || _pkgtab ||
              ' ALTER ' || _tabs[i] || '_id SET NOT NULL,' ||
              ' ADD PRIMARY KEY (' || _tabs[i] || '_id),' ||
              ' ALTER ' || _tabs[i] || '_id SET DEFAULT NEXTVAL(''' ||
              _tabs[i] || '_' || _tabs[i] || '_id_seq'');';

      EXECUTE 'REVOKE ALL ON ' || _pkgtab || ' FROM PUBLIC;';
      EXECUTE 'GRANT  ALL ON ' || _pkgtab || ' TO GROUP xtrole;';

      IF (_tabs[i] = 'cmdarg') THEN
        EXECUTE 'ALTER TABLE ' || _pkgtab ||
                ' ADD FOREIGN KEY (cmdarg_cmd_id) REFERENCES ' ||
                pname || '.pkgcmd(cmd_id);';
      END IF;

      EXECUTE 'SELECT dropIfExists(''TRIGGER'', ''pkg' ||
                                   _tabs[i] || 'beforetrigger'', ''' ||
                                   pname || ''');' ;
      EXECUTE 'CREATE TRIGGER pkg' || _tabs[i] || 'beforetrigger ' ||
              'BEFORE INSERT OR UPDATE OR DELETE ON ' || _pkgtab ||
              ' FOR EACH ROW EXECUTE PROCEDURE _pkg' || _tabs[i] || 'beforetrigger();';

      EXECUTE 'SELECT dropIfExists(''TRIGGER'', ''pkg' ||
                                   _tabs[i] || 'altertrigger'', ''' ||
                                   pname || ''');' ;
      EXECUTE 'CREATE TRIGGER pkg' || _tabs[i] || 'altertrigger ' ||
              'BEFORE INSERT OR UPDATE OR DELETE ON ' || _pkgtab ||
              ' FOR EACH ROW EXECUTE PROCEDURE _pkg' || _tabs[i] || 'altertrigger();';

      EXECUTE 'SELECT dropIfExists(''TRIGGER'', ''pkg' ||
                                   _tabs[i] || 'aftertrigger'', ''' ||
                                   pname || ''');' ;
      EXECUTE 'CREATE TRIGGER pkg' || _tabs[i] || 'aftertrigger ' ||
              'AFTER INSERT OR UPDATE OR DELETE ON ' || _pkgtab ||
              ' FOR EACH ROW EXECUTE PROCEDURE _pkg' || _tabs[i] || 'aftertrigger();';

    END IF;
  END LOOP;

  EXECUTE 'COMMENT ON SCHEMA ' || quote_ident(pname) || ' IS ' ||
           quote_literal(pcomment) || ';';

  RETURN _namespaceoid;
END;
$$
LANGUAGE 'plpgsql';
