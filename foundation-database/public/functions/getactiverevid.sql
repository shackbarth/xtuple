CREATE OR REPLACE FUNCTION getActiveRevId(TEXT,INTEGER) RETURNS INTEGER STABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pTargetType ALIAS FOR $1;
  pTargetid ALIAS FOR $2;
  _revid INTEGER;

BEGIN
  --See if revcontrol turned on
  IF (fetchmetricbool('RevControl')) THEN

    IF (pTargetType='BOM') THEN
      SELECT rev_id INTO _revid
      FROM rev
      WHERE ((rev_target_type='BOM')
      AND (rev_target_id=pTargetid)
      AND (rev_status='A'));
      IF (NOT FOUND) THEN
        _revid:=-1;
      END IF;

      ELSE IF (pTargetType='BOO') THEN
      SELECT rev_id INTO _revid
      FROM rev
      WHERE ((rev_target_type='BOO')
      AND (rev_target_id=pTargetid)
      AND (rev_status='A'));
      IF (NOT FOUND) THEN
        _revid:=-1;
      END IF;

      ELSE
        RAISE EXCEPTION 'Invalid Revision Type';
      END IF;
    END IF;

  ELSE
    _revid:=-1;
  END IF;

  RETURN _revid;

END;
$$ LANGUAGE 'plpgsql';
