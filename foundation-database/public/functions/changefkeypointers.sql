CREATE OR REPLACE FUNCTION changeFKeyPointers(TEXT, TEXT, INTEGER, INTEGER, TEXT[], BOOLEAN) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pSchema       ALIAS FOR $1;
  pTable        ALIAS FOR $2;
  pSourceId     ALIAS FOR $3;
  pTargetId     ALIAS FOR $4;
  pIgnore       ALIAS FOR $5;
  _purge        BOOLEAN := COALESCE($6, FALSE);

  _counter      INTEGER := 0;
  _count1       INTEGER := 0;
  _fk           RECORD;
  _pk           TEXT[];

BEGIN
  -- for all foreign keys that point to pSchema.pTable
  FOR _fk IN
    EXECUTE 'SELECT fkeyns.nspname AS schemaname, fkeytab.relname AS tablename,
                    conkey, attname, typname
               FROM pg_constraint
               JOIN pg_class     basetab ON (confrelid=basetab.oid)
               JOIN pg_namespace basens  ON (basetab.relnamespace=basens.oid)
               JOIN pg_class     fkeytab ON (conrelid=fkeytab.oid)
               JOIN pg_namespace fkeyns  ON (fkeytab.relnamespace=fkeyns.oid)
               JOIN pg_attribute         ON (attrelid=conrelid AND attnum=conkey[1])
               JOIN pg_type              ON (atttypid=pg_type.oid)
              WHERE basetab.relname = ' || quote_literal(pTable)  || '
                AND basens.nspname  = ' || quote_literal(pSchema) || '
                AND fkeytab.relname NOT IN (''' || ARRAY_TO_STRING(pIgnore, ''', ''') || ''')'
  LOOP
    IF (ARRAY_UPPER(_fk.conkey, 1) > 1) THEN
      RAISE EXCEPTION 'Cannot change the foreign key in %.% that refers to %.% because the foreign key constraint has multiple columns. [xtuple: changefkeypointers, -1, %.%, %.%]',
        _fk.schemaname, _fk.tablename, pSchema, pTable,
        _fk.schemaname, _fk.tablename, pSchema, pTable;
    END IF;
    
    -- optionally make a backup copy of the data
    IF (NOT _purge) THEN
      -- determine the primary key column of the fkey table
      _pk := primaryKeyFields(_fk.schemaname, _fk.tablename);
      IF (ARRAY_UPPER(_pk, 1) > 1) THEN
        RAISE EXCEPTION 'Cannot change foreign key references in %.% because it has a composite primary key. Try setting the purge option. [xtuple: changefkeypointers, -4, %.%]',
                        _fk.schemaname, _fk.tablename, _fk.schemaname, _fk.tablename;
      END IF;

      -- make the backup copy
      EXECUTE 'INSERT INTO mrgundo (
                     mrgundo_schema,      mrgundo_table,
                     mrgundo_pkey_col,    mrgundo_pkey_id,
                     mrgundo_col,         mrgundo_value,      mrgundo_type,
                     mrgundo_base_schema, mrgundo_base_table, mrgundo_base_id
             ) SELECT ' || quote_literal(_fk.schemaname) || ', '
                        || quote_literal(_fk.tablename)  || ', '
                        || quote_literal(_pk[1])         || ', ' 
                        || _pk[1]                        || ', '
                        || quote_literal(_fk.attname)    || ', ' 
                        || _fk.attname                   || ', ' 
                        || quote_literal(_fk.typname)    || ', '
                        || quote_literal(pSchema)        || ', '
                        || quote_literal(pTable)         || ', '
                        || pTargetId                     || '
                 FROM ' || _fk.schemaname || '.' || _fk.tablename ||
              ' WHERE ('|| _fk.attname    || '=' || pSourceId || ');';
    END IF;

    -- actually change the foreign keys to point to the desired base table record
    EXECUTE 'UPDATE '  || _fk.schemaname || '.' || _fk.tablename ||
              ' SET '  || _fk.attname    || '=' || pTargetId ||
            ' WHERE (' || _fk.attname    || '=' || pSourceId || ');';

    GET DIAGNOSTICS _count1 = ROW_COUNT;
    _counter := _counter + _count1;
  END LOOP;

  RETURN _counter;
END;
$$ LANGUAGE 'plpgsql';

COMMENT ON FUNCTION changeFKeyPointers(TEXT, TEXT, INTEGER, INTEGER, TEXT[], BOOLEAN) IS
'Change the data in all tables with foreign key relationships so they point to the pSchema.pTable record with primary key pTargetId instead of the record with primary key pSourceId. Ignore any tables listed in pIgnore. If the final arg is TRUE, make a backup copy of the original data in the mrgundo table.';
