CREATE OR REPLACE FUNCTION bomworkItemSequence(INTEGER) RETURNS TEXT AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pWorkid ALIAS FOR $1;
  _wid INTEGER;
  _seqnum TEXT;
  _bomwork RECORD;

BEGIN
  _wid := pWorkid;

  SELECT bomwork_parent_id AS parent,
         item_number AS seq INTO _bomwork
    FROM bomwork, item
   WHERE ((bomwork_id=_wid)
   AND (bomwork_item_id=item_id));

  IF (FOUND) THEN
    _seqnum := _bomwork.seq;
    _wid := _bomwork.parent;

    WHILE (_wid != -1) LOOP
      SELECT bomwork_parent_id AS parent,
             item_number AS seq INTO _bomwork
      FROM bomwork, item
      WHERE ((bomwork_id=_wid)
      AND (bomwork_item_id=item_id));

      IF (FOUND) THEN
        _seqnum := _bomwork.seq || '-' || _seqnum;
        _wid    := _bomwork.parent;
      ELSE
        _wid := -1;
      END IF;
    END LOOP;
  ELSE
    _seqnum := ''::TEXT;
  END IF;

  RETURN _seqnum;
END;
$$ LANGUAGE 'plpgsql';
