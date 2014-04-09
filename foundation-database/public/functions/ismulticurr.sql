
CREATE OR REPLACE FUNCTION isMultiCurr() RETURNS BOOL IMMUTABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  RETURN (SELECT (count(*) > 1)
          FROM curr_symbol);
END;
$$ LANGUAGE 'plpgsql';

