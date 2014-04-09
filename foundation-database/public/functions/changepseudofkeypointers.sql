CREATE OR REPLACE FUNCTION changePseudoFKeyPointers(TEXT, TEXT, TEXT, INTEGER, TEXT, TEXT, INTEGER, TEXT, TEXT, BOOLEAN) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pSchema       ALIAS FOR $1;
  pTable        ALIAS FOR $2;
  pFkeyCol      ALIAS FOR $3;
  pSourceId     ALIAS FOR $4;
  pBaseSchema   ALIAS FOR $5;
  pBaseTable    ALIAS FOR $6;
  pTargetId     ALIAS FOR $7;
  pTypeCol      ALIAS FOR $8;
  pType         ALIAS FOR $9;
  _purge        BOOLEAN := COALESCE($10, FALSE);

  _counter      INTEGER := 0;
  _coltype      TEXT;
  _pk           TEXT[];

BEGIN
  IF (NOT _purge) THEN
    EXECUTE 'SELECT typname
               FROM pg_type
               JOIN pg_attribute ON (pg_type.oid=atttypid)
               JOIN pg_class     ON (attrelid=pg_class.oid)
               JOIN pg_namespace ON (relnamespace=pg_namespace.oid)
              WHERE (relname=' || quote_literal(pTable)   || ')
                AND (nspname=' || quote_literal(pSchema)  || ')
                AND (attname=' || quote_literal(pFkeyCol) || ')' INTO _coltype;

    _pk := primaryKeyFields(pSchema, pTable);
    IF (ARRAY_UPPER(_pk, 1) > 1) THEN
       RAISE EXCEPTION 'Cannot change pseudo-foreign key references in %.% because it has a composite primary key. Try setting the purge option. [xtuple: changepseudofkeypointers, -1, %.%',
                        pSchema, pTable, pSchema, pTable;
    END IF;

    EXECUTE 'INSERT INTO mrgundo (
                     mrgundo_schema,      mrgundo_table,
                     mrgundo_pkey_col,    mrgundo_pkey_id,
                     mrgundo_col,         mrgundo_value,      mrgundo_type,
                     mrgundo_base_schema, mrgundo_base_table, mrgundo_base_id
           ) SELECT ' || quote_literal(pSchema)     || ', '
                      || quote_literal(pTable)      || ', '
                      || quote_literal(_pk[1])      || ', ' 
                      || quote_ident(_pk[1])        || ', '
                      || quote_literal(pFkeyCol)    || ', ' 
                      || quote_ident(pFkeyCol)      || ', ' 
                      || quote_literal(_coltype)    || ', '
                      || quote_literal(pBaseSchema) || ', '
                      || quote_literal(pBaseTable)  || ', '
                      || pTargetId                  || '
               FROM '  || quote_ident(pSchema)  || '.' || quote_ident(pTable) || '
              WHERE (('|| quote_ident(pFkeyCol) || '=' || pSourceId || ')
                 AND ('|| quote_ident(pTypeCol) || '=' || quote_literal(pType) || '));';
  END IF;

  -- actually change the foreign keys to point to the desired base table record
  EXECUTE 'UPDATE '  || quote_ident(pSchema)  || '.' || quote_ident(pTable) ||
            ' SET '  || quote_ident(pFkeyCol) || '=' || pTargetId ||
          ' WHERE ((' || quote_ident(pFkeyCol) || '=' || pSourceId || ')
               AND (' || quote_ident(pTypeCol) || '=' || quote_literal(pType) || '));';

  GET DIAGNOSTICS _counter = ROW_COUNT;

  RETURN _counter;
END;
$$ LANGUAGE 'plpgsql';

COMMENT ON FUNCTION changePseudoFKeyPointers(TEXT, TEXT, TEXT, INTEGER, TEXT, TEXT, INTEGER, TEXT, TEXT, BOOLEAN) IS
'Change the data in pSchema.pTable with a pseudo-foreign key relationship to another (unnamed) table. Make pSchema.pTable point to the record with primary key pTargetId instead of the record with primary key pSourceId. pSchema.pTable cannot have a true foreign key relationship because it holds data that can point to any of several tables. The pType value in the pTypeCol column describes which table the data refer to (e.g. "T" may indicate that the current record refers to a "cntct"). If the final arg is TRUE, make a backup copy of the data in the mrgundo table.';
