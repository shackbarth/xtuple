
CREATE OR REPLACE FUNCTION intervalToMinutes(INTERVAL) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
  SELECT (EXTRACT(DAY FROM $1) * 24 * 60 +
          EXTRACT(HOUR FROM $1) * 60 +
          EXTRACT(MINUTE FROM $1) +
          ROUND((EXTRACT(SECOND FROM $1) / 60)::NUMERIC, 4))::NUMERIC AS result
$$ LANGUAGE 'sql';

