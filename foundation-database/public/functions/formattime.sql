
CREATE OR REPLACE FUNCTION formatTime(TIMESTAMP WITH TIME ZONE) RETURNS TEXT IMMUTABLE AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
  SELECT TO_CHAR($1, ( SELECT locale_timeformat
                       FROM locale, usr
                       WHERE ((usr_locale_id=locale_id)
                        AND (usr_username=getEffectiveXtUser())) ) ) AS result
' LANGUAGE 'sql';


CREATE OR REPLACE FUNCTION formatTime(NUMERIC) RETURNS TEXT IMMUTABLE AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
  SELECT LTRIM(TO_CHAR(COALESCE($1, 0), ''999999990.0''));
' LANGUAGE 'sql';

