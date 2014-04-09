CREATE OR REPLACE FUNCTION formatSoNumber(INTEGER) RETURNS TEXT AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
SELECT COALESCE((SELECT (text(cohead_number) || '-' || formatSoLineNumber(coitem_id))
                   FROM coitem JOIN cohead ON (coitem_cohead_id=cohead_id)
                  WHERE (coitem_id=($1))),'DELETED');
$$ LANGUAGE 'sql' STABLE;
