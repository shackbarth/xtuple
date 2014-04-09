CREATE OR REPLACE FUNCTION FetchDefaultFob(pWarehousId INTEGER) RETURNS TEXT AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
  SELECT warehous_fob
    FROM whsinfo
   WHERE (warehous_id=$1);
$$ LANGUAGE SQL;
