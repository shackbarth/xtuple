
CREATE OR REPLACE FUNCTION findPeriodStart(INTEGER) RETURNS DATE STABLE AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCalitemid ALIAS FOR $1;
  _calType CHAR(1);
  _calItem RECORD;
  _start DATE;
  _loop INTEGER;

BEGIN

  SELECT calhead_type INTO _calType
  FROM calhead, acalitem
  WHERE ((acalitem_calhead_id=calhead_id)
   AND (acalitem_id=pCalitemid));

  IF (NOT FOUND) THEN
    SELECT calhead_type INTO _calType
    FROM calhead, rcalitem
    WHERE ((rcalitem_calhead_id=calhead_id)
     AND (rcalitem_id=pCalitemid));

    IF (NOT FOUND) THEN
      RETURN NULL;
    END IF;
  END IF;

  IF (_calType = ''A'') THEN
    RETURN ( SELECT acalitem_periodstart
             FROM acalitem
             WHERE (acalitem_id=pCalitemid) );

  ELSIF (_calType = ''R'') THEN

--  Grab the relative calitem''s particulars
    SELECT rcalitem_offsettype, rcalitem_offsetcount INTO _calitem
    FROM rcalitem
    WHERE (rcalitem_id=pCalitemid);

    IF (NOT FOUND) THEN
      RETURN NULL;
    END If;

--  Grab the origin of the calitem''s parend calhead
    SELECT findCalendarOrigin(calhead_id) INTO _start
    FROM calhead, rcalitem
    WHERE ((rcalitem_calhead_id=calhead_id)
     AND (rcalitem_id=pCalitemid));

--  If days...
    IF (_calitem.rcalitem_offsettype = ''D'') THEN
      _start := (_start + _calitem.rcalitem_offsetcount);

--  If weeks...
    ELSIF (_calitem.rcalitem_offsettype = ''W'') THEN
      _start := (_start + (_calitem.rcalitem_offsetcount * 7));

--  If months... (gotta be a better way)
    ELSIF (_calitem.rcalitem_offsettype = ''M'') THEN
      _loop := _calitem.rcalitem_offsetcount;

      IF (_loop > 0) THEN
        WHILE (_loop > 0) LOOP
          _start := (_start + INTERVAL ''1 month'');
          _loop := _loop - 1;
        END LOOP;
      ELSE
        WHILE (_loop < 0) LOOP
          _start := (_start - INTERVAL ''1 month'');
          _loop := _loop + 1;
        END LOOP;
      END IF;

--  If years... (gotta be a better way)
    ELSIF (_calitem.rcalitem_offsettype = ''Y'') THEN
      _loop := _calitem.rcalitem_offsetcount;

      IF (_loop > 0) THEN
        WHILE (_loop > 0) LOOP
          _start := (_start + INTERVAL ''1 year'');
          _loop := _loop - 1;
        END LOOP;
      ELSE
        WHILE (_loop < 0) LOOP
          _start := (_start - INTERVAL ''1 year'');
          _loop := _loop + 1;
        END LOOP;
      END IF;

    ELSE
      _start := NULL;
    END IF;

  ELSE
    _start := NULL;
  END IF;

  RETURN _start;

END;
'LANGUAGE 'plpgsql';

