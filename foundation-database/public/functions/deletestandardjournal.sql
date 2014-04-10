
CREATE OR REPLACE FUNCTION deleteStandardJournal(INTEGER) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pStdjrnlid ALIAS FOR $1;

BEGIN

  DELETE FROM stdjrnlitem
  WHERE (stdjrnlitem_stdjrnl_id=pStdjrnlid);

  DELETE FROM stdjrnlgrpitem
  WHERE (stdjrnlgrpitem_stdjrnl_id=pStdjrnlid);

  DELETE FROM stdjrnl
  WHERE (stdjrnl_id=pStdjrnlid);

  RETURN 1;

END;
' LANGUAGE 'plpgsql';

