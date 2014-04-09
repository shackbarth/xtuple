CREATE OR REPLACE FUNCTION itemSellingUOM(INTEGER) RETURNS TEXT AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemid ALIAS FOR $1;

BEGIN
  RETURN itemUOMByType(pItemid, ''Selling'');
END;
' LANGUAGE 'plpgsql';
