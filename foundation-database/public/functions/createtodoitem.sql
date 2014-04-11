
CREATE OR REPLACE FUNCTION createTodoItem(INTEGER, TEXT, TEXT, TEXT, INTEGER, INTEGER, INTEGER, DATE, DATE, CHARACTER(1), DATE, DATE, INTEGER, TEXT, TEXT) RETURNS INTEGER AS $$  
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  RETURN createTodoItem($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NULL);
END;
$$ LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION createTodoItem(INTEGER, TEXT, TEXT, TEXT, INTEGER, INTEGER, INTEGER, DATE, DATE, CHARACTER(1), DATE, DATE, INTEGER, TEXT, TEXT, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  ptodoid     ALIAS FOR  $1;
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
  powner      ALIAS FOR $15;
  pcntctid    ALIAS FOR $16;

  _todoid     INTEGER;
  _priority   INTEGER         := ppriority;
  _status     CHARACTER(1)    := pstatus;
  _incdtid    INTEGER         := pincdtid;
  _crmacctid  INTEGER         := pcrmacctid;
  _opheadid   INTEGER         := pOpheadid;
  _assigned   DATE            := passigned;
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

  IF (ptodoid IS NULL) THEN
    SELECT NEXTVAL('todoitem_todoitem_id_seq') INTO _todoid;
  ELSE
    _todoid := ptodoid;
  END IF;

  INSERT INTO todoitem ( todoitem_id, todoitem_username, todoitem_name,
                         todoitem_description, todoitem_incdt_id,
                         todoitem_creator_username, todoitem_status,
                         todoitem_active, todoitem_start_date,
                         todoitem_due_date, todoitem_assigned_date,
                         todoitem_completed_date, todoitem_priority_id,
                         todoitem_notes, todoitem_crmacct_id,
                         todoitem_ophead_id, todoitem_owner_username,
                         todoitem_cntct_id
              ) VALUES ( _todoid, pusername, pname,
                         pdesc, _incdtid,
                         getEffectiveXtUser(), _status,
                         TRUE, pstarted,
                         pdue, _assigned,
                         pcompleted, _priority, pnotes, _crmacctid, _opheadid, powner,
                         pcntctid );

  RETURN _todoid;
END;
$$ LANGUAGE 'plpgsql';


