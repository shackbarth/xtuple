CREATE OR REPLACE FUNCTION createRecurringItems(INTEGER, TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pParentid  ALIAS FOR $1;      -- if NULL then all items with the given pType
  pType      TEXT := UPPER($2); -- if NULL then all types
                                -- if both are null then all items of all types
  _copystmt  TEXT;
  _count     INTEGER := 0;
  _countstmt TEXT;
  _existcnt  INTEGER;
  _id        INTEGER;
  _interval  TEXT;
  _last      TIMESTAMP WITH TIME ZONE;
  _loopcount INTEGER := 1;
  _maxstmt   TEXT;
  _maxdate   TIMESTAMP WITH TIME ZONE := endOfTime();
  _result    INTEGER := 0;
  _next      TIMESTAMP WITH TIME ZONE;
  _r         RECORD;
  _rt        RECORD;
  _tmp       INTEGER;

BEGIN
  RAISE DEBUG 'createRecurringItems(%, %) entered', pParentid, pType;

  FOR _r IN SELECT *
              FROM recur
             WHERE ((COALESCE(recur_end, endOfTime()) >= CURRENT_TIMESTAMP)
                AND (pParentid IS NULL OR recur_parent_id=pParentid)
                AND (pType IS NULL OR UPPER(recur_parent_type)=UPPER(pType))) LOOP

    RAISE DEBUG 'createRecurringItems looking at recur %, %',
                _r.recur_id, _r.recur_parent_type;
    _r.recur_max := COALESCE(_r.recur_max,
                             CAST(fetchMetricValue('RecurringInvoiceBuffer') AS INTEGER),
                             1);
    _interval := CASE _r.recur_period WHEN 'Y' THEN ' year'
                                      WHEN 'M' THEN ' month'
                                      WHEN 'W' THEN ' week'
                                      WHEN 'D' THEN ' day'
                                      WHEN 'H' THEN ' hour'
                                      WHEN 'm' THEN ' minute'
                                      ELSE NULL
                 END;

    IF (_interval IS NULL OR COALESCE(_r.recur_freq, 0) <= 0) THEN
      RAISE EXCEPTION 'Unknown recurrence frequency % % ON % %',
                      _r.recur_freq,        _r.recur_period,
                      _r.recur_parent_type, _r.recur_parent_id;
    END IF;

    SELECT * INTO _rt FROM recurtype WHERE (UPPER(recurtype_type)=UPPER(pType));
    GET DIAGNOSTICS _count = ROW_COUNT;
    IF (_count <= 0) THEN
      RETURN -10;
    END IF;

    -- if the recurrence type has a max lookahead window, use it
    IF (_r.recur_parent_type = 'I') THEN
      _maxdate := CURRENT_TIMESTAMP + CAST(fetchMetricText('RecurringInvoiceBuffer') || ' days' AS INTERVAL);
    END IF;
    IF (_r.recur_parent_type = 'V') THEN
      _maxdate := CURRENT_TIMESTAMP + CAST(fetchMetricText('RecurringVoucherBuffer') || ' days' AS INTERVAL);
    END IF;
    IF (_maxdate > _r.recur_end) THEN   -- if recur_end is null, _maxdate is ok
      _maxdate = _r.recur_end;
    END IF;

    -- build statements dynamically from the recurtype table because packages
    -- might also require recurring items. this way the algorithm is fixed
    -- and the details are data-driven
    _countstmt := 'SELECT COUNT(*) FROM [fulltable]' 
               || ' WHERE (($1=[table]_recurring_[table]_id)'
               || ' AND NOT([done]) '
               || ' AND ([limit]));';
    _countstmt := REPLACE(_countstmt, '[fulltable]', _rt.recurtype_table);
    _countstmt := REPLACE(_countstmt, '[table]',
                          REGEXP_REPLACE(_rt.recurtype_table, E'.*\\.', ''));
    _countstmt := REPLACE(_countstmt, '[done]',  _rt.recurtype_donecheck);
    _countstmt := REPLACE(_countstmt, '[limit]',
                          COALESCE(_rt.recurtype_limit, 'TRUE'));

    _maxstmt := 'SELECT MAX([schedcol]) FROM [fulltable]'
               || ' WHERE (($1=[table]_recurring_[table]_id)'
               || '    AND ([limit]));';
    _maxstmt := REPLACE(_maxstmt, '[schedcol]', _rt.recurtype_schedcol);
    _maxstmt := REPLACE(_maxstmt, '[fulltable]',_rt.recurtype_table);
    _maxstmt := REPLACE(_maxstmt, '[table]',
                          REGEXP_REPLACE(_rt.recurtype_table, E'.*\\.', ''));
    _maxstmt := REPLACE(_maxstmt, '[limit]', COALESCE(_rt.recurtype_limit,
                                                     'TRUE'));

    _copystmt := 'SELECT [copy]($1, [datetime] [more]);';
    _copystmt := REPLACE(_copystmt, '[copy]', _rt.recurtype_copyfunc);
    _copystmt := REPLACE(_copystmt, '[datetime]',
                         CASE WHEN UPPER(_rt.recurtype_copyargs[2])='DATE' THEN
                                    'CAST(''$2'' AS DATE)'
                              ELSE '''$2''' END);
    -- 8.4+:
    -- _copystmt := REPLACE(_copystmt, '[more]',
    --                      REPEAT(', NULL',
    --                             array_length(_rt.recurtype_copyargs) - 2));
    _tmp := CAST(REPLACE(REGEXP_REPLACE(array_dims(_rt.recurtype_copyargs),
                                        '.*:', ''), ']', '') AS INTEGER);
    _copystmt := REPLACE(_copystmt, '[more]', REPEAT(', NULL', _tmp - 2));

    EXECUTE REPLACE(_countstmt, '$1', _r.recur_parent_id::TEXT) INTO _existcnt;
    EXECUTE REPLACE(_maxstmt,   '$1', _r.recur_parent_id::TEXT) INTO _last;
    RAISE DEBUG E'% got %, % got %', _countstmt, _existcnt, _maxstmt, _last;

    _next := _last;
    _loopcount := 1;
    WHILE (_existcnt < _r.recur_max AND _next < _maxdate) LOOP
      _next := _last +
               CAST(_r.recur_freq * _loopcount || _interval AS INTERVAL);
      RAISE DEBUG 'createrecurringitems looping, existcnt = %, max = %, is % between % and %?',
                  _existcnt, _r.recur_max, _next, _r.recur_start, _r.recur_end;

      IF (_next BETWEEN _r.recur_start AND _maxdate) THEN
        RAISE DEBUG 'createrecurringitems executing % with % and %',
                    _copystmt, _r.recur_parent_id, _next;
        -- 8.4+: EXECUTE _copystmt INTO _id USING _r.recur_parent_id, _next;
        EXECUTE REPLACE(REPLACE(_copystmt, '$1', _r.recur_parent_id::TEXT),
                                           '$2', _next::TEXT) INTO _id;
        RAISE DEBUG 'Copying for % returned %', _next, _id;
        _result   := _result   + 1;
        _existcnt := _existcnt + 1;
      END IF;
      _loopcount := _loopcount + 1;
    END LOOP;
  END LOOP;

  RETURN _result;
END;
$$ LANGUAGE 'plpgsql';
