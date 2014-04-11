CREATE OR REPLACE FUNCTION splitRecurrence(INTEGER, TEXT, TIMESTAMP WITH TIME ZONE) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pParentid     ALIAS FOR $1;
  pType         TEXT := UPPER($2);
  pDatetime     TIMESTAMP WITH TIME ZONE := COALESCE($3, CURRENT_TIMESTAMP);

  _count         INTEGER;
  _newrecurid    INTEGER;
  _newparentid   INTEGER;
  _newparentstmt TEXT;
  _rt            RECORD;
  _updchildstmt  TEXT;

BEGIN
  IF (pParentid IS NULL) THEN
    RETURN -11;
  END IF;

  SELECT * INTO _rt FROM recurtype WHERE (UPPER(recurtype_type)=pType);
  GET DIAGNOSTICS _count = ROW_COUNT;
  IF (_count <= 0) THEN
    RETURN -10;
  END IF;

  _newparentstmt := 'SELECT [table]_id FROM [fulltable]'
                 || ' WHERE (([table]_recurring_[table]_id=$1)'
                 || '    AND NOT ([done])'
                 || '    AND ([schedcol]>=''$2''))'
                 || ' ORDER BY [schedcol]'
                 || ' LIMIT 1;';
  _newparentstmt := REPLACE(_newparentstmt, '[fulltable]', _rt.recurtype_table);
  _newparentstmt := REPLACE(_newparentstmt, '[table]',
                            REGEXP_REPLACE(_rt.recurtype_table, E'.*\\.', ''));
  _newparentstmt := REPLACE(_newparentstmt, '[done]',  _rt.recurtype_donecheck);
  _newparentstmt := REPLACE(_newparentstmt, '[schedcol]', _rt.recurtype_schedcol);
  _updchildstmt := 'UPDATE [fulltable] SET [table]_recurring_[table]_id=$1'
                || ' WHERE (([table]_recurring_[table]_id=$2)'
                || '   AND NOT ([done])'
                || '   AND ([schedcol] > ''$3''));';
  _updchildstmt := REPLACE(_updchildstmt, '[fulltable]', _rt.recurtype_table);
  _updchildstmt := REPLACE(_updchildstmt, '[table]',
                           REGEXP_REPLACE(_rt.recurtype_table, E'.*\\.', ''));
  _updchildstmt := REPLACE(_updchildstmt, '[done]',  _rt.recurtype_donecheck);
  _updchildstmt := REPLACE(_updchildstmt, '[schedcol]', _rt.recurtype_schedcol);

  -- 8.4+: EXECUTE _newparentstmt INTO _newparentid USING pParentid, pDatetime;
  EXECUTE REPLACE(REPLACE(_newparentstmt, '$1', pParentid::TEXT),
                                          '$2', pDatetime::TEXT)
          INTO _newparentid;

  -- if nothing to split
  IF (_newparentid = pParentid OR _newparentid IS NULL) THEN
    SELECT recur_id INTO _newrecurid
      FROM recur
     WHERE ((recur_parent_id=pParentid)
        AND (recur_parent_type=pType));

  ELSE
    INSERT INTO recur (recur_parent_id, recur_parent_type, recur_period,
                       recur_freq,      recur_start,       recur_end,
                       recur_max,       recur_data
             ) SELECT _newparentid,     pType,             recur_period,
                      recur_freq,       pDatetime,         recur_end,
                      recur_max,        recur_data
                 FROM recur
                WHERE ((recur_parent_id=pParentid)
                   AND (recur_parent_type=pType))
      RETURNING recur_id INTO _newrecurid;

    UPDATE recur SET recur_end=pDatetime
    WHERE ((recur_parent_id=pParentid)
       AND (recur_parent_type=pType));

    -- 8.4+: EXECUTE _updchildstmt USING _newparentid, pParentid, pDatetime;
    EXECUTE REPLACE(REPLACE(REPLACE(_updchildstmt, '$1', _newparentid::TEXT),
                                                   '$2', pParentid::TEXT),
                                                   '$3', pDatetime::TEXT);
  END IF;

  RETURN _newrecurid;
END;
$$ LANGUAGE 'plpgsql';
