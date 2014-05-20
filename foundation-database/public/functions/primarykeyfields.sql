CREATE OR REPLACE FUNCTION primaryKeyFields(TEXT, TEXT) RETURNS TEXT[] AS $$ 
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pSchema       ALIAS FOR $1;
  pRelation     ALIAS FOR $2;
  _colname      TEXT;
  _counter      INTEGER := 0;
  _result       TEXT[];

BEGIN
  EXECUTE 'SELECT ARRAY(SELECT attname
                         FROM pg_attribute
                         JOIN pg_class idx ON (attrelid         = idx.oid)
                         JOIN pg_namespace ON (idx.relnamespace = pg_namespace.oid)
                         JOIN pg_index     ON (idx.oid          = indexrelid)
                         JOIN pg_class tab ON (indrelid         = tab.oid)
                        WHERE NOT attisdropped
                          AND nspname = ''' || pSchema || ''' 
                          AND indisprimary
                          AND LOWER(tab.relname) = ''' || pRelation || '''
                       ORDER BY attnum);'
  INTO _result;

  RETURN _result;
END;
$$ LANGUAGE 'plpgsql' STABLE;

COMMENT ON FUNCTION primaryKeyFields(TEXT, TEXT) IS 'Return an array containing the names of the primary key fields of pSchema.pRelation. The first key field is in _result[1].';
