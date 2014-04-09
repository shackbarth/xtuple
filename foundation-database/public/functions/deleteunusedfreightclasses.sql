CREATE OR REPLACE FUNCTION deleteUnusedFreightClasses() RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN

  DELETE FROM freightclass
  WHERE (freightclass_id NOT IN (SELECT DISTINCT COALESCE(item_freightclass_id, 0) FROM item));

  RETURN 0;

END;
$$ LANGUAGE 'plpgsql';
