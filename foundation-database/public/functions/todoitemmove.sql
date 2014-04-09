
CREATE OR REPLACE FUNCTION todoItemMove(INTEGER, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  ptodoItemId ALIAS FOR $1;
  pHowFar     ALIAS FOR $2;   -- -1 moves toward front of list, +1 toward back
  _howFar     INTEGER := pHowFar;
  _username   TEXT;
  _currseq    INTEGER;
BEGIN
  SELECT todoitem_username, todoitem_seq INTO _username, _currseq
  FROM todoitem
  WHERE todoitem_id = ptodoItemId;

  IF NOT FOUND THEN
    RETURN -1;
  END IF;

  IF (_currseq + pHowFar <= 0) THEN
    _howFar = 1 - _currseq;   -- move to beginning
  END IF;

  UPDATE todoitem
  SET todoitem_seq=todoitem_seq - _howFar
  WHERE todoitem_seq >= _currseq + _howFar
    AND todoitem_id != ptodoItemId
    AND todoitem_username = _username
    AND todoitem_status != 'C';

  UPDATE todoitem
  SET todoitem_seq=_currseq + _howFar
  WHERE todoitem_id = ptodoItemId;

  RETURN 0;
END;
$$ LANGUAGE 'plpgsql';

