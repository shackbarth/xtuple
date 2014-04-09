
CREATE OR REPLACE FUNCTION deleteStandardJournalGroup(INTEGER) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pStdjrnlgrpid ALIAS FOR $1;

BEGIN

  DELETE FROM stdjrnlgrpitem
  WHERE (stdjrnlgrpitem_stdjrnlgrp_id=pStdjrnlgrpid);

  DELETE FROM stdjrnlgrp
  WHERE (stdjrnlgrp_id=pStdjrnlgrpid);

  RETURN 1;

END;
' LANGUAGE 'plpgsql';

