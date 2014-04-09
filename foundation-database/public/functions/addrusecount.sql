CREATE OR REPLACE FUNCTION addrUseCount(integer) RETURNS integer STABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pAddrId ALIAS FOR $1;
  _fk RECORD;
  _r RECORD;
  _seq INTEGER;
  _col TEXT;
  _qry TEXT;
  _count INTEGER = 0;

BEGIN
  -- Determine where this address is used by analyzing foreign key linkages
  -- TO DO: Can this be rationalized with cntctused(int)?
  FOR _fk IN
    SELECT pg_namespace.nspname AS schemaname, con.relname AS tablename, conkey AS seq, conrelid AS class_id 
    FROM pg_constraint, pg_class f, pg_class con, pg_namespace
    WHERE confrelid=f.oid
    AND conrelid=con.oid
    AND f.relname = 'addr'
    AND con.relnamespace=pg_namespace.oid
    AND con.relname NOT IN ('pohead') -- exception(s) where address key doesn't actually drive document information
  LOOP
    -- Validate
    IF (ARRAY_UPPER(_fk.seq,1) > 1) THEN
      RAISE EXCEPTION 'Checks to tables where the address is one of multiple foreign key columns is not supported. Error on Table: %',
        pg_namespace.nspname || '.' || con.relname;
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
            WHERE ('|| _col || '=' || pAddrId || ');';

    FOR _r IN 
      EXECUTE _qry
    LOOP
      _count := _count + 1;
    END LOOP;
         
  END LOOP;

  RETURN _count;

END;
$$ LANGUAGE 'plpgsql';
