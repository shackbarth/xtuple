CREATE OR REPLACE FUNCTION openRecurringItems(INTEGER, TEXT, TIMESTAMP WITH TIME ZONE) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pParentid  ALIAS FOR $1;
  pType      TEXT := UPPER($2);
  pDatetime  TIMESTAMP WITH TIME ZONE := COALESCE($3, CURRENT_TIMESTAMP);

  _count     INTEGER := -1;
  _countstmt TEXT;
  _rt        RECORD;

BEGIN
  IF (pParentid IS NULL) THEN
    RETURN -11;
  END IF;
  
  SELECT * INTO _rt FROM recurtype WHERE (UPPER(recurtype_type)=pType);
  GET DIAGNOSTICS _count = ROW_COUNT;
  IF (_count <= 0) THEN
    RETURN -10;
  END IF;

  _countstmt := 'SELECT COUNT(*) FROM [fulltable]'
             || ' WHERE (NOT ([done])'
             || '    AND ([schedcol]>=''$1'')'
             || '    AND ([table]_recurring_[table]_id=''$2''));';
  _countstmt := REPLACE(_countstmt, '[fulltable]',    _rt.recurtype_table);
  _countstmt := REPLACE(_countstmt, '[table]',
                        REGEXP_REPLACE(_rt.recurtype_table, E'.*\\.', ''));
  _countstmt := REPLACE(_countstmt, '[done]',     _rt.recurtype_donecheck);
  _countstmt := REPLACE(_countstmt, '[schedcol]', _rt.recurtype_schedcol);

  -- 8.4+: EXECUTE _countstmt INTO _count USING pDatetime, pParentid;
  EXECUTE REPLACE(REPLACE(_countstmt, '$1', pDatetime::TEXT),
                                      '$2', pParentid::TEXT) INTO _count;

  RETURN _count;
END;
$$ LANGUAGE 'plpgsql';
