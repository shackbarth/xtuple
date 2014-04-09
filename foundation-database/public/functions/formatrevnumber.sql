CREATE OR REPLACE FUNCTION formatRevNumber(TEXT, INTEGER) RETURNS TEXT AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pRevType 	ALIAS FOR $1;
  pRevId 	ALIAS FOR $2;
  _revision 	TEXT;

BEGIN
  --See if revision control turned on (Postbooks will not ever have this)
  IF (fetchmetricbool(''RevControl'')) THEN
    SELECT rev_number INTO _revision
    FROM rev
    WHERE ((rev_target_type=pRevType)
    AND (rev_id=pRevId));
  END IF;

  RETURN COALESCE(_revision,'''');

END;
' LANGUAGE 'plpgsql';
