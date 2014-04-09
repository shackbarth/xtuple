CREATE OR REPLACE FUNCTION itemCapUOM(INTEGER) RETURNS TEXT STABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemid ALIAS FOR $1;

BEGIN
  RETURN itemUOMByType(pItemid, 'Capacity');
END;
$$ LANGUAGE 'plpgsql';
