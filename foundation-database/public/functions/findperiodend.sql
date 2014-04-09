
CREATE OR REPLACE FUNCTION findPeriodEnd(INTEGER) RETURNS DATE STABLE AS '
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
    RETURN ( SELECT (findPeriodStart(acalitem_id) + acalitem_periodlength - 1)
             FROM acalitem
             WHERE (acalitem_id=pCalitemid) );

  ELSIF (_calType = ''R'') THEN

--  Grab the relative calitem''s particulars
    SELECT rcalitem_periodtype, rcalitem_periodcount INTO _calitem
    FROM rcalitem
    WHERE (rcalitem_id=pCalitemid);

    IF (NOT FOUND) THEN
      RETURN NULL;
    END If;

--  Grab the origin of the calitem
    SELECT findPeriodStart(pCalitemid) INTO _start;

    IF (_start IS NULL) THEN

--  If days...
    ELSIF (_calitem.rcalitem_periodtype = ''D'') THEN
      _start := (_start + _calitem.rcalitem_periodcount - 1);

--  If weeks... (gotta be a better way)
    ELSIF (_calitem.rcalitem_periodtype = ''W'') THEN
      _loop := _calitem.rcalitem_periodcount;

      WHILE (_loop > 0) LOOP
        _start := (_start + INTERVAL ''1 week'');
        _loop := (_loop - 1);
      END LOOP;

      _start := (_start - 1);

--  If months... (gotta be a better way)
    ELSIF (_calitem.rcalitem_periodtype = ''M'') THEN
      _loop := _calitem.rcalitem_periodcount;

      WHILE (_loop > 0) LOOP
        _start := (_start + INTERVAL ''1 month'');
        _loop := (_loop - 1);
      END LOOP;

      _start := (_start - 1);

--  If years... (gotta be a better way)
    ELSIF (_calitem.rcalitem_periodtype = ''Y'') THEN
      _loop := _calitem.rcalitem_periodcount;

      WHILE (_loop > 0) LOOP
        _start := (_start + INTERVAL ''1 year'');
        _loop := (_loop - 1);
      END LOOP;

      _start := (_start - 1);

    ELSE
      _start := NULL;
    END IF;

  ELSE
    _start := NULL;
  END IF;

  RETURN _start;

END;
'LANGUAGE 'plpgsql';

