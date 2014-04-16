CREATE OR REPLACE FUNCTION deleteUnusedClassCodes() RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN

  DELETE FROM classcode
  WHERE (classcode_id NOT IN (SELECT DISTINCT item_classcode_id FROM item));

  RETURN 0;

END;
$$ LANGUAGE 'plpgsql';
