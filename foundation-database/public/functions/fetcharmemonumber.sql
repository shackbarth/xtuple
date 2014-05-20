
CREATE OR REPLACE FUNCTION fetchARMemoNumber() RETURNS TEXT AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
  SELECT fetchNextNumber('ARMemoNumber');
$$ LANGUAGE 'sql';

