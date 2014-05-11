CREATE OR REPLACE FUNCTION releaseAPMemoNumber(INTEGER) RETURNS BOOLEAN AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
  SELECT releaseNumber('APMemoNumber', $1::INTEGER) > 0;
$$ LANGUAGE 'sql';
