CREATE OR REPLACE FUNCTION moveUpDown(pId      INTEGER,
                                      pSchema  TEXT,
                                      pTable   TEXT,
                                      pSeqCol  TEXT, 
                                      pJoinCol TEXT,
                                      pExtra   TEXT,
                                      pDir     TEXT) RETURNS INTEGER AS $$
DECLARE
  _keyfield TEXT;
  _keysize  INTEGER;
  _qry      TEXT;
  _r        RECORD;
  _rowcnt   INTEGER;
  _schema   TEXT := COALESCE(pSchema, 'public');
BEGIN
  RAISE DEBUG 'moveUpDown(%, %, %, %, %, %, %) entered',
              pId, pSchema, pTable, pSeqCol, pJoinCol, pExtra, pDir;

  IF (UPPER(pDir) NOT IN ('UP', 'DOWN')) THEN
     RAISE EXCEPTION 'Cannot change the order of records; unsure what % means for sequencing [xtuple: moveUpDown, -1, %, %.%]',
                     pDir, pDir, _schema, pTable;
  END IF;

  SELECT attname, ARRAY_UPPER(conkey, 1) INTO _keyfield, _keysize
    FROM pg_attribute
    JOIN pg_constraint ON (attrelid=conrelid AND attnum=conkey[1])
    JOIN pg_class      ON (conrelid=pg_class.oid)
    JOIN pg_namespace  ON (relnamespace=pg_namespace.oid)
   WHERE ((contype='p')
      AND (nspname=_schema)
      AND (relname=pTable));

  RAISE DEBUG 'SELECT attname... returned %, %', _keyfield, _keysize;

  IF (_keysize > 1) THEN
    RAISE EXCEPTION 'Cannot change the order of records because %.% has a composite primary key [xtuple: moveUpDown, -2, %.%]',
                     _schema, pTable,
                     _schema, pTable;
  END IF;

  /* SELECT next._keyfield AS nextid,
            next.pSeqCol   AS nextseq,
            this.pSeqCol   AS thisseq
       FROM _schema.pTable AS next,
            _schema.pTable AS this
      WHERE (this._keyfield=$1)
          AND (next.pSeqCol [> or <] this.pSeqCol)
        [ AND (next.pJoinCol=this.pJoinCol) ]
        [ AND (pExtra) ]
      ORDER BY nextseq [ DESC or ASC ]
      LIMIT 1;
  */

  _qry := 'SELECT next.' || quote_ident(_keyfield) || ' AS nextid,
                  next.' || quote_ident(pSeqCol)   || ' AS nextseq,
                  this.' || quote_ident(pSeqCol)   || ' AS thisseq
             FROM ' || _schema || '.' || quote_ident(pTable) || ' AS next,
                  ' || _schema || '.' || quote_ident(pTable) || ' AS this
            WHERE ((this.' || quote_ident(_keyfield)  || '=$1)
               AND (next.' || quote_ident(pSeqCol)    ||
                    CASE pDir WHEN 'UP' THEN ' < ' ELSE ' > ' END ||
                   'this.' || quote_ident(pSeqCol) || ')' ||
               CASE WHEN pJoinCol IS NULL THEN ''
                    ELSE ' AND (next.' || quote_ident(pJoinCol)  ||
                         '=this.' || quote_ident(pJoinCol) || ')'
               END ||
          '     AND (' || COALESCE(pExtra, 'TRUE') || '))
            ORDER BY nextseq ' ||
               CASE pDir WHEN 'UP' THEN 'DESC' ELSE 'ASC' END ||
          ' LIMIT 1;';
  RAISE DEBUG 'moveUpDown about to use % when running %', pId, _qry;

  EXECUTE _qry INTO _r USING pId;
  GET DIAGNOSTICS _rowcnt = ROW_COUNT;
  RAISE DEBUG 'next id %, next seq %, this id %, this seq %',
               _r.nextid, _r.nextseq, pId, _r.thisseq;

  IF (_rowcnt > 0) THEN
    _qry := 'UPDATE ' || _schema || '.' || quote_ident(pTable)  ||
              ' SET ' || pSeqCol || '=CAST($1 AS INTEGER)
             WHERE (' || quote_ident(_keyfield) || '=$2);';

    EXECUTE _qry USING -1,         _r.nextid;
    EXECUTE _qry USING _r.nextseq, pId;
    EXECUTE _qry USING _r.thisseq, _r.nextid;
    RETURN _r.nextid;
  END IF;

  RETURN pId;
END;
$$
LANGUAGE 'plpgsql';

COMMENT ON FUNCTION moveUpDown(INTEGER, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) IS
'moveUpDown moves a particular record up or down in an ordered list.
      pId argument names the record to move.
      pSchema (uses public if NULL) and pTable name the table holding the list.
      pSeqCol is the column that holds the sequence number.
      pJoinCol is the column that distinguishes one list from another in the same table, or NULL if the table holds only one list.
      pExtra is an extra join clause that may be required, or NULL.
      pDir is either UP, meaning move the pId record closer to the beginning,
                or DOWN.
Returns the id of the record with which pId was swapped,
      or pId if the record was already at the end in the specified direction.';
