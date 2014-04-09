CREATE OR REPLACE FUNCTION deleteOpenRecurringItems(INTEGER, TEXT, TIMESTAMP WITH TIME ZONE, BOOLEAN) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pParentid     ALIAS FOR $1;
  pType         TEXT                     := UPPER($2);
  pDatetime     TIMESTAMP WITH TIME ZONE := COALESCE($3, startOfTime());
  pInclParent   BOOLEAN                  := COALESCE($4, FALSE);

  _count         INTEGER := 0;
  _delchildstmt  TEXT;
  _delparentstmt TEXT;
  _rt            RECORD;
  _tmp           INTEGER;
BEGIN
  RAISE DEBUG 'deleteOpenRecurringItems(%, %, %)', pParentid, pType, pDatetime;

  IF (pParentid IS NULL) THEN
    RETURN -11;
  END IF;

  SELECT * INTO _rt FROM recurtype WHERE (UPPER(recurtype_type)=pType);
  GET DIAGNOSTICS _count = ROW_COUNT;
  IF (_count <= 0) THEN
    RETURN -10;
  END IF;

  -- 2 deletes avoid reparenting problems if the parent gets deleted first
  IF (_rt.recurtype_delfunc IS NULL) THEN
    _delchildstmt := 'DELETE FROM [fulltable] '
                  || ' WHERE (NOT ([done])'
                  || '    AND ([schedcol]>''$2'')'
                  || '    AND ([table]_recurring_[table]_id=$1)'
                  || '    AND ([table]_id!=$1));';

    _delparentstmt := 'DELETE FROM [fulltable] USING recur'
                   || ' WHERE (NOT ([done])'
                   || '    AND ([schedcol]>''$2'')'
                   || '    AND ([table]_recurring_[table]_id=$1)'
                   || '    AND ([table]_id=$1));';

  ELSE
    _delchildstmt := 'SELECT [delfunc]([table]_id)'
                  || '  FROM [fulltable] '
                  || ' WHERE (NOT ([done])'
                  || '    AND ([schedcol]>''$2'')'
                  || '    AND ([table]_recurring_[table]_id=$1)'
                  || '    AND ([table]_id!=$1));';
    _delparentstmt := 'SELECT [delfunc]([table]_id)'
                   || '  FROM [fulltable] '
                   || ' WHERE (NOT ([done])'
                   || '    AND ([schedcol]>''$2'')'
                   || '    AND ([table]_recurring_[table]_id=$1)'
                   || '    AND ([table]_id!=$1));';
    _delchildstmt  := REPLACE(_delchildstmt,  '[delfunc]', _rt.recurtype_delfunc);
    _delparentstmt := REPLACE(_delparentstmt, '[delfunc]', _rt.recurtype_delfunc);
  END IF;

  RAISE DEBUG '_delchildstmt has been set to %', _delchildstmt;

  _delchildstmt := REPLACE(_delchildstmt, '[fulltable]', _rt.recurtype_table);
  _delchildstmt := REPLACE(_delchildstmt, '[table]',
                            REGEXP_REPLACE(_rt.recurtype_table, E'.*\\.', ''));
  _delchildstmt := REPLACE(_delchildstmt, '[done]',  _rt.recurtype_donecheck);
  _delchildstmt := REPLACE(_delchildstmt, '[schedcol]', _rt.recurtype_schedcol);

  _delparentstmt := REPLACE(_delparentstmt, '[fulltable]', _rt.recurtype_table);
  _delparentstmt := REPLACE(_delparentstmt, '[table]',
                            REGEXP_REPLACE(_rt.recurtype_table, E'.*\\.', ''));
  _delparentstmt := REPLACE(_delparentstmt, '[done]',  _rt.recurtype_donecheck);
  _delparentstmt := REPLACE(_delparentstmt, '[schedcol]', _rt.recurtype_schedcol);

  RAISE DEBUG 'substitutions changed _delchildstmt to %', _delchildstmt;

  IF (_rt.recurtype_delfunc IS NULL) THEN
    -- 8.4+: EXECUTE _delchildstmt  USING pDatetime, pType;
    RAISE DEBUG '% with % and %', _delchildstmt, pType, pDatetime;
    EXECUTE REPLACE(REPLACE(_delchildstmt, '$1', pParentid::TEXT),
                                           '$2', pDatetime::TEXT);
    GET DIAGNOSTICS _count = ROW_COUNT;

    IF (pInclParent) THEN
      -- 8.4+: EXECUTE _delparentstmt USING pDatetime, pType;
      RAISE DEBUG '% with % and %', _delparentstmt, pType, pDatetime;
      EXECUTE REPLACE(REPLACE(_delparentstmt, '$1', pParentid::TEXT),
                                              '$2', pDatetime::TEXT);
      GET DIAGNOSTICS _tmp   = ROW_COUNT;
      _count := _count + _tmp;
    END IF;

  ELSE
    -- 8.4+: FOR _tmp IN EXECUTE _delchildstmt USING pDatetime, pType LOOP
    FOR _tmp IN EXECUTE REPLACE(REPLACE(_delchildstmt, '$1', pParentid::TEXT),
                                                       '$2', pDatetime::TEXT)
    LOOP
      IF _tmp < 0 THEN
        RETURN _tmp;
      END IF;
      _count := _count + 1;
    END LOOP;

    IF (pInclParent) THEN
      -- 8.4+: EXECUTE _delparentstmt INTO _tmp USING pDatetime, pType;
      EXECUTE REPLACE(REPLACE(_delparentstmt, '$1', pParentid::TEXT),
                                              '$2', pDatetime::TEXT) INTO _tmp;
      IF (_tmp < 0) THEN
        RETURN _tmp;
      END IF;
      _count := _count + 1;
    END IF;
  END IF;

  RAISE DEBUG 'deleteOpenrecurringItems() returning %', _count;
  RETURN _count;
END;
$$ LANGUAGE 'plpgsql';
