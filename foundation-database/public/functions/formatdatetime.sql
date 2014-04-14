
CREATE OR REPLACE FUNCTION formatDateTime(TIMESTAMP WITHOUT TIME ZONE) RETURNS TEXT IMMUTABLE AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
SELECT TO_CHAR($1, COALESCE((SELECT locale_timestampformat
                             FROM locale, usr
                             WHERE ((usr_locale_id=locale_id)
                              AND (usr_username=getEffectiveXtUser())) ),
                            ''yyyy-mm-dd HH24:MI:SS'')) AS result
' LANGUAGE 'sql';

CREATE OR REPLACE FUNCTION formatDateTime(TIMESTAMP WITH TIME ZONE) RETURNS TEXT IMMUTABLE AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
SELECT TO_CHAR($1, COALESCE((SELECT locale_timestampformat
                             FROM locale, usr
                             WHERE ((usr_locale_id=locale_id)
                              AND (usr_username=getEffectiveXtUser())) ),
                            ''yyyy-mm-dd HH24:MI:SS'')) AS result
' LANGUAGE 'sql';

