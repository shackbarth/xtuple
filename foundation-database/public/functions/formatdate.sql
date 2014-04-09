
CREATE OR REPLACE FUNCTION formatDate(TIMESTAMP WITH TIME ZONE) RETURNS TEXT IMMUTABLE AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
SELECT TO_CHAR($1, COALESCE((SELECT locale_dateformat
                             FROM locale, usr
                             WHERE ((usr_locale_id=locale_id)
                              AND (usr_username=getEffectiveXtUser())) ),
                            ''yyyy-mm-dd'' )) AS result
' LANGUAGE 'sql';


CREATE OR REPLACE FUNCTION formatDate(DATE) RETURNS TEXT IMMUTABLE AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
SELECT TO_CHAR($1, COALESCE((SELECT locale_dateformat
                             FROM locale, usr
                             WHERE ((usr_locale_id=locale_id)
                              AND (usr_username=getEffectiveXtUser())) ),
                            ''yyyy-mm-dd'') ) AS result
' LANGUAGE 'sql';

CREATE OR REPLACE FUNCTION formatDate(DATE, TEXT) RETURNS TEXT IMMUTABLE AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pDate ALIAS FOR $1;
  pString ALIAS FOR $2;

BEGIN

  IF ( (pDate = startOfTime()) OR
       (pDate = endOfTime()) OR
       (pDate IS NULL) ) THEN
    RETURN pString;
  ELSE
    RETURN formatDate(pDate);
  END IF;

END;
' LANGUAGE 'plpgsql';

