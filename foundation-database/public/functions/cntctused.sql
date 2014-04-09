CREATE OR REPLACE FUNCTION cntctused(integer) RETURNS boolean AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCntctId ALIAS FOR $1;
  _fk RECORD;
  _r RECORD;
  _seq INTEGER;
  _col TEXT;
  _qry TEXT;

BEGIN
  -- Determine where this contact is used by analyzing foreign key linkages
  -- but ignore child tables and those with impermanent relationships
  FOR _fk IN
    SELECT pg_namespace.nspname AS schemaname, con.relname AS tablename, conkey AS seq, conrelid AS class_id 
    FROM pg_constraint, pg_class f, pg_class con, pg_namespace
    WHERE confrelid=f.oid
    AND conrelid=con.oid
    AND f.relname = 'cntct'
    AND con.relnamespace=pg_namespace.oid
    AND con.relname NOT IN ('cntctaddr', 'cntctdata', 'cntcteml',
                            'cohead',    'pohead',    'quhead',   'tohead',
                            'cntctsel',  'cntctmrgd', 'mrghist',  'trgthist')
  LOOP
    -- Validate
    IF (ARRAY_UPPER(_fk.seq,1) > 1) THEN
      RAISE EXCEPTION 'Cannot check dependencies when the contact is one of multiple foreign key columns (%.%) [xtuple: fkeycheck, -1, %, %]',
        _fk.nspname, _fk.relname, _fk.nspname, _fk.relname;
    END IF;
    
    _seq := _fk.seq[1];

    -- Get the specific column name
    SELECT attname INTO _col
    FROM pg_attribute, pg_class
    WHERE ((attrelid=pg_class.oid)
    AND (pg_class.oid=_fk.class_id)
    AND (attnum=_seq));

    -- See if there are dependencies
    _qry := 'SELECT * 
            FROM ' || _fk.schemaname || '.' || _fk.tablename || '
            WHERE ('|| _col || '=' || pCntctId || ');';

    FOR _r IN 
      EXECUTE _qry
    LOOP
      RETURN true;
    END LOOP;
         
  END LOOP;

  RETURN false;

END;
$$ LANGUAGE 'plpgsql';
