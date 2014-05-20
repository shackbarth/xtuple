CREATE OR REPLACE FUNCTION fetchCRMAccountNumber() RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
  SELECT fetchNextNumber('CRMAccountNumber')::INTEGER;
$$ LANGUAGE 'sql';

