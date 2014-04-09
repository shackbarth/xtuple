CREATE OR REPLACE FUNCTION updateListPrice(INTEGER, NUMERIC) RETURNS NUMERIC AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemid ALIAS FOR $1;
  pUpdateBy ALIAS FOR $2;

BEGIN

  UPDATE item
  SET item_listprice = (item_listprice * pUpdateBy)
  WHERE (item_id=pItemid);

  RETURN 1;

END;
' LANGUAGE 'plpgsql';
