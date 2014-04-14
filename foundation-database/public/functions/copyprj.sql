CREATE OR REPLACE FUNCTION copyPrj(INTEGER, DATE) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pparentid   ALIAS FOR $1;
  _counter    INTEGER;
  _duedate    DATE := COALESCE($2, CURRENT_DATE);
  _alarmid    INTEGER;
  _i          INTEGER;
  _newnumber  TEXT;
  _p          RECORD;
  _prjid      INTEGER;
  _testnumber TEXT;

BEGIN
  RAISE DEBUG 'copyPrj(%, %) entered', pparentid, _duedate;

  SELECT * INTO _p
  FROM prj
  WHERE (prj_id=pparentid);

  -- new number = old number up to but not including -, followed by _duedate
  -- e.g. REPAIR-FRIDGE becomes REPAIR-2010-05-15
  --  but REPAIR_FRIDGE becomes REPAIR_FRIDGE-2010-05-15
  IF (_p.prj_recurring_prj_id IS NULL) THEN
    _newnumber := _p.prj_number;
  ELSE
    _newnumber := SUBSTRING(_p.prj_number FROM '[^-]*');
    IF (_newnumber IS NULL) THEN
      _newnumber := _p.prj_number;
    END IF;
  END IF;
  _newnumber := _newnumber || '-' || to_char(_duedate, 'YYYY-MM-DD');
  
  RAISE DEBUG 'copyPrj checking if _newnumber % exists', _newnumber;
  SELECT MAX(prj_number) INTO _testnumber
    FROM prj
   WHERE (prj_number ~ ('^' || _newnumber));
  IF (_testnumber = _newnumber) THEN
    _newnumber := _newnumber || '-001';
  ELSIF (_testnumber IS NOT NULL) THEN
    _counter := CAST(SUBSTRING(_testnumber FROM '...$') AS INTEGER);
    _counter := _counter + 1;
    _newnumber := REGEXP_REPLACE(_testnumber, '...$', to_char(_counter, 'FM009'));
  END IF;
  RAISE DEBUG 'copyPrj _newnumber is now %', _newnumber;

  INSERT INTO prj(
            prj_number,     prj_name,           prj_descrip,
            prj_status,     prj_so,             prj_wo,
            prj_po,         prj_owner_username, prj_prjtype_id,
            prj_due_date,   prj_username,       prj_recurring_prj_id
  ) SELECT  _newnumber,     _p.prj_name,        _p.prj_descrip,
            'P',            _p.prj_so,          _p.prj_wo,
            _p.prj_po,      _p.prj_owner_username, _p.prj_prjtype_id,
            _duedate,       _p.prj_username,    _p. prj_recurring_prj_id
      FROM prj
     WHERE (prj_id=pparentid)
  RETURNING prj_id INTO _prjid;

  IF (_prjid IS NULL) THEN
    RETURN -1;
  END IF;

  SELECT saveAlarm(NULL, NULL, _duedate,
                   CAST(alarm_time - DATE_TRUNC('day',alarm_time) AS TIME),
                   alarm_time_offset,
                   alarm_time_qualifier,
                   alarm_event_recipient  IS NOT NULL, alarm_event_recipient,
                   alarm_email_recipient  IS NOT NULL, alarm_email_recipient,
                   alarm_sysmsg_recipient IS NOT NULL, alarm_sysmsg_recipient,
                   'J', _prjid, 'CHANGEONE')
    INTO _alarmid
    FROM alarm
   WHERE ((alarm_source='J')
      AND (alarm_source_id=pparentid));

   IF (_alarmid < 0) THEN
     RETURN _alarmid;
   END IF;

  RETURN _prjid;
END;
$$ LANGUAGE 'plpgsql';
