
-- treat NUMERIC as number of minutes
CREATE OR REPLACE FUNCTION formatInterval(NUMERIC) RETURNS TEXT IMMUTABLE AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
  SELECT TO_CHAR((''@ '' || trunc($1) || '' min '' ||
                             ($1 - trunc($1)) * 60 || '' sec'')::INTERVAL,
                 ( SELECT locale_intervalformat
                       FROM locale, usr
                       WHERE ((usr_locale_id=locale_id)
                         AND  (usr_username=getEffectiveXtUser())) ) ) AS result
' LANGUAGE 'sql';

CREATE OR REPLACE FUNCTION formatInterval(INTERVAL) RETURNS TEXT IMMUTABLE AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
  SELECT TO_CHAR($1, ( SELECT locale_intervalformat
                       FROM locale, usr
                       WHERE ((usr_locale_id=locale_id)
                         AND  (usr_username=getEffectiveXtUser())) ) ) AS result
' LANGUAGE 'sql';

