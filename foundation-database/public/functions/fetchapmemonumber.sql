CREATE OR REPLACE FUNCTION fetchAPMemoNumber() RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
  SELECT fetchNextNumber('APMemoNumber')::INTEGER;
$$ LANGUAGE 'sql';
