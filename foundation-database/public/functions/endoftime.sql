
CREATE OR REPLACE FUNCTION endoftime() RETURNS DATE IMMUTABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
SELECT DATE('2100-01-01') as result;
$$ LANGUAGE sql;

