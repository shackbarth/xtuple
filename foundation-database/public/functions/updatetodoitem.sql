
CREATE OR REPLACE FUNCTION updateTodoItem(INTEGER, TEXT, TEXT, TEXT, INTEGER, INTEGER, INTEGER, DATE, DATE, CHARACTER(1), DATE, DATE, INTEGER, TEXT, BOOLEAN, TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  RETURN updateTodoItem($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NULL);
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION updateTodoItem(INTEGER, TEXT, TEXT, TEXT, INTEGER, INTEGER, INTEGER, DATE, DATE, CHARACTER(1), DATE, DATE, INTEGER, TEXT, BOOLEAN, TEXT, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  ptodoitemid ALIAS FOR  $1;
  pusername   ALIAS FOR  $2;
  pname       ALIAS FOR  $3;
  pdesc       ALIAS FOR  $4;
  pincdtid    ALIAS FOR  $5;
  pcrmacctid  ALIAS FOR  $6;
  pOpheadid   ALIAS FOR  $7;
  pstarted    ALIAS FOR  $8;
  pdue        ALIAS FOR  $9;
  pstatus     ALIAS FOR $10;
  passigned   ALIAS FOR $11;
  pcompleted  ALIAS FOR $12;
  ppriority   ALIAS FOR $13;
  pnotes      ALIAS FOR $14;
  pactive     ALIAS FOR $15;
  powner	ALIAS FOR $16;
  pcntctid	ALIAS FOR $17;

  _priority   INTEGER         := ppriority;
  _status     CHARACTER(1)    := pstatus;
  _incdtid    INTEGER         := pincdtid;
  _crmacctid  INTEGER         := pcrmacctid;
  _opheadid   INTEGER         := pOpheadid;
  _assigned   DATE            := passigned;
  _active     BOOL            := pactive;
  _result     INTEGER;

BEGIN
  IF (pusername IS NULL OR pusername = '') THEN
    RETURN -1;
  END IF;

  IF (pname IS NULL OR pname = '') THEN
    RETURN -2;
  END IF;

  IF (pdue IS NULL) THEN
    RETURN -3;
  END IF;

  IF (ptodoitemid IS NULL OR ptodoitemid <= 0) THEN
    RETURN -10;
  END IF;

  IF (pcompleted IS NOT NULL) THEN
    _status := 'C';
  ELSIF (pstatus IS NULL AND pstarted IS NOT NULL) THEN
    _status := 'I';
  ELSIF (pstatus IS NULL) THEN
    _status := 'N';
  END IF;

  IF (_incdtid <= 0) THEN
    _incdtid := NULL;
  END IF;

  IF (_crmacctid <= 0) THEN
    _crmacctid := NULL;
  END IF;

  IF (_opheadid <= 0) THEN
    _opheadid := NULL;
  END IF;

  IF (_priority <= 0) THEN
    _priority := NULL;
  END IF;

  IF (_assigned IS NULL) THEN
    _assigned := CURRENT_DATE;
  END IF;

  IF (_active IS NULL) THEN
    _active := TRUE;
  END IF;

  UPDATE todoitem SET
      todoitem_username=pusername, todoitem_name=pname, todoitem_description=pdesc,
      todoitem_incdt_id=_incdtid, todoitem_status=_status,
      todoitem_active=_active, todoitem_start_date=pstarted,
      todoitem_due_date=pdue, todoitem_assigned_date=_assigned,
      todoitem_completed_date=pcompleted, todoitem_priority_id=_priority,
      todoitem_notes=pnotes, todoitem_crmacct_id=_crmacctid,
      todoitem_ophead_id=_opheadid, todoitem_owner_username=powner,
      todoitem_cntct_id=pcntctid
  WHERE (todoitem_id=ptodoitemid);

  RETURN ptodoitemid;
END;
$$ LANGUAGE 'plpgsql';


