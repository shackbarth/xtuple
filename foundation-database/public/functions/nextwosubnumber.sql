CREATE OR REPLACE FUNCTION nextWoSubnumber(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
SELECT COALESCE((MAX(wo_subnumber) + 1), 1)
FROM wo
WHERE (wo_number=($1));
$$ LANGUAGE 'sql';
