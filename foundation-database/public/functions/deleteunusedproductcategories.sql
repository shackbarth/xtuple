CREATE OR REPLACE FUNCTION deleteUnusedProductCategories() RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN

--  Delete any associated records
  DELETE FROM salesaccnt
  WHERE ( (salesaccnt_prodcat_id <> -1)
   AND (salesaccnt_prodcat_id NOT IN (SELECT DISTINCT item_prodcat_id FROM item)) );

  DELETE FROM prodcat
  WHERE (prodcat_id NOT IN (SELECT DISTINCT item_prodcat_id FROM item));

  RETURN 0;

END;
$$ LANGUAGE 'plpgsql';
