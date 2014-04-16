CREATE OR REPLACE FUNCTION bomhistSequence(INTEGER) RETURNS TEXT AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pHistid ALIAS FOR $1;
  _wid INTEGER;
  _seqnum TEXT;
  _bomhist RECORD;

BEGIN
  _wid := pHistid;

  SELECT bomhist_parent_id AS parent,
         to_char(bomhist_seqnumber, '00009') AS seq INTO _bomhist
    FROM bomhist
   WHERE bomhist_seq_id=_wid;

  IF (FOUND) THEN
    _seqnum := _bomhist.seq;
    _wid := _bomhist.parent;

    WHILE (_wid != -1) LOOP
      SELECT bomhist_parent_id AS parent,
             to_char(bomhist_seqnumber, '00009') AS seq INTO _bomhist
      FROM bomhist
      WHERE bomhist_seq_id=_wid;

      IF (FOUND) THEN
        _seqnum := _bomhist.seq || '-' || _seqnum;
        _wid    := _bomhist.parent;
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
