CREATE OR REPLACE FUNCTION fetchWoNumber() RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
  SELECT fetchNextNumber('WoNumber')::INTEGER;
$$ LANGUAGE 'sql';
