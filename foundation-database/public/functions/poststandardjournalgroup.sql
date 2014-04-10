
CREATE OR REPLACE FUNCTION postStandardJournalGroup(INTEGER, DATE) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pStdjrnlgrpid ALIAS FOR $1;
  pDate ALIAS FOR $2;
BEGIN
  RETURN postStandardJournalGroup(pStdjrnlgrpid, pDate, FALSE);
END;
' LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION postStandardJournalGroup(INTEGER, DATE, BOOLEAN) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pStdjrnlgrpid ALIAS FOR $1;
  pDate ALIAS FOR $2;
  pReverse ALIAS FOR $3;
  _r RECORD;
  _glSequence INTEGER := -1;

BEGIN

  FOR _r IN SELECT stdjrnlgrpitem_id, stdjrnlgrpitem_stdjrnl_id
            FROM stdjrnlgrpitem
            WHERE ( (stdjrnlgrpitem_stdjrnlgrp_id=pStdjrnlgrpid)
             AND (CURRENT_DATE BETWEEN stdjrnlgrpitem_effective AND (stdjrnlgrpitem_expires - 1))
             AND ( (stdjrnlgrpitem_toapply = -1)
              OR (stdjrnlgrpitem_toapply > stdjrnlgrpitem_applied) ) ) LOOP

    IF (_glSequence = -1) THEN
      SELECT fetchGLSequence() INTO _glSequence;
    END IF;

    PERFORM postStandardJournal(_r.stdjrnlgrpitem_stdjrnl_id, pDate, pReverse, _glSequence);

    UPDATE stdjrnlgrpitem
    SET stdjrnlgrpitem_applied=(stdjrnlgrpitem_applied + 1)
    WHERE (stdjrnlgrpitem_id=_r.stdjrnlgrpitem_id);

  END LOOP;

  RETURN _glSequence;

END;
' LANGUAGE 'plpgsql';

